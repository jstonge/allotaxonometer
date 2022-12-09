import { sum, which } from './utils_helpers'

function divElems(inv_r1, inv_r2, alpha) {
  if (alpha === Infinity) {
      return inv_r1.map((d,i) => inv_r1[i] == inv_r2[i] ? 0 : Math.max(inv_r1[i], inv_r2[i]))
  } else if (alpha == 0) {
      const x_max = inv_r1.map((d,i) => Math.max(1 / inv_r1[i], 1 / inv_r2[i]))
      const x_min = inv_r1.map((d,i) => Math.min(1 / inv_r1[i], 1 / inv_r2[i]))
      return inv_r1.map((d,i) => Math.log10(x_max[i] / x_min[i]))
  } else {
      return inv_r1.map((d,i) => (alpha+1) / alpha * Math.abs(inv_r1[i]**alpha - inv_r2[i]**alpha)**(1. / (alpha+1)))
    }
}

function norm_divElems(mixedelements, inv_r1, inv_r2, alpha) {
  const c1 = mixedelements[0]['counts']  
  const c2 = mixedelements[1]['counts']

  const indices1 = which(c1.map(d => d > 0))
  const indices2 = which(c2.map(d => d > 0))

  const N1 = indices1.length
  const N2 = indices2.length

  // calculate disjoint  set (could maybe go in utils)
  function calc_disjoint(N1, N2) { 
    return( 1 / (N2 + N1/2) )
    }
  
  const inv_r1_disjoint = calc_disjoint(N1, N2) 
  const inv_r2_disjoint = calc_disjoint(N2, N1) 
  
  if (alpha === Infinity) {
    
      return sum(indices1.map((i) => inv_r1[i])) + sum(indices2.map((i) => inv_r2[i]))
    
  } else if (alpha === 0) {
      const term1 = sum(
        indices1.map((i) => Math.abs(Math.log(inv_r1[i] / inv_r2_disjoint)))
      )
      const term2 = sum(
        indices2.map((i) => Math.abs(Math.log(inv_r2[i] / inv_r1_disjoint)))
      )
      return term1 + term2 
  } else {
      const term1 = (alpha+1)/alpha * sum( 
        indices1.map((i) => inv_r1[i]).map( d => (Math.abs(d**alpha) - inv_r2_disjoint**alpha)**(1./(alpha+1) ))
      )
      const term2 = (alpha+1)/alpha * sum(
        indices2.map((i) => inv_r2[i]).map(d => Math.abs(inv_r1_disjoint**alpha - d**alpha)**(1. / (alpha+1)))
      )
      return term1 + term2
    }
}

export default function rank_turbulence_divergence(mixedelements, alpha) {

  const inv_r1 = mixedelements[0]['ranks'].map(d => Math.pow(d, -1))
  const inv_r2 = mixedelements[1]['ranks'].map(d => Math.pow(d, -1))
  
  const divergence_elements = divElems(inv_r1, inv_r2, alpha)
  const normalization = norm_divElems(mixedelements, inv_r1, inv_r2, alpha)
  
  return { // the divergence used to wordshift dat to sort name in wordshift plot
         // is equal to the formula in the upperleft of the diamond plot. However
         // the formula is a proportionality and miss the normalization constant 
         // shown here. 
         // Example: for alpha = infinity, for the rank 1 names on both systems, the formula as written is equal to max(1/1, 1/former_rank) = 1/1 =1
         // this value of 1 is then divided by the normalization constant.
         // this constant of proportionality is the reason for the difference between the 1/1 that the written formula gives you
         // and the decimal value that wordshift_dat states and which is actuallly used to sort the types.
    'divergence_elements': divergence_elements.map(d => d / normalization), 
    'normalization': normalization
  }
}