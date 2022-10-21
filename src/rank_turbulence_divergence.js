function divElems(inv_r1, inv_r2, alpha) {
  if (alpha === Infinity) {
      return inv_r1.map((d,i) => inv_r1[i] == inv_r2[i] ? 0 : Math.max(inv_r1[i], inv_r2[i]))
  } else if (alpha == 0) {
      const x_max = inv_r1.map((d,i) => Math.max(1 / inv_r1[i], 1 / inv_r2[i]))
      const x_min = inv_r1.map((d,i) => Math.min(1 / inv_r1[i], 1 / inv_r2[i]))
      return inv_r1.map((d,i) => Math.log10(x_max[i] / x_min[i]))
  } else {
      return (alpha+1)/alpha*inv_r1.map((d,i) => Math.abs(inv_r1[i]**alpha - inv_r2[i]**alpha))**(1. / (alpha+1))
    }
}

function norm_divElems(mixedelements, inv_r1, inv_r2, alpha) {
  const c1 = mixedelements[0]['counts']  
  const c2 = mixedelements[1]['counts']

  const indices1 = utils.which(c1.map(d => d > 0))
  const indices2 = utils.which(c2.map(d => d > 0))

  const N1 = indices1.length
  const N2 = indices2.length

  // calculate disjoint  set (could maybe go in utils)
  function calc_disjoint() { 
    assert(typeof N1 === "number", "not a number")
    assert(typeof N2 === "number", "not a number")
    return( 1 / (N2 + N1/2) )
    }
  
  const inv_r1_disjoint = calc_disjoint(N1, N2) 
  const inv_r2_disjoint = calc_disjoint(N2, N1) 
  
  if (alpha === Infinity) {
    
      return utils.sum(indices1.map((i) => inv_r1[i])) + utils.sum(indices2.map((i) => inv_r2[i]))
    
  } else if (alpha === 0) {
      const term1 = utils.sum(
        indices1.map((i) => inv_r1[i]).map(d => d / inv_r1_disjoint).map(Math.log10)
      )
      const term2 = utils.sum(
        indices2.map((i) => inv_r2[i]).map(d => d / inv_r2_disjoint).map(Math.log10)
      )
      return term1 + term2 
  } else {
      const term1 = (alpha+1)/alpha * utils.sum( 
        indices1.map((i) => inv_r1[i]).map( d => (Math.abs(d**alpha) - inv_r2_disjoint**alpha)**(1./(alpha+1) ))
      )
      const term2 = (alpha+1)/alpha * utils.sum(
        indices2.map((i) => inv_r2[i]).map(d => Math.abs(inv_r1_disjoint**alpha - d**alpha)**(1. / (alpha+1)))
      )
      return term1 + term2
    }
}

export default function rank_turbulence_divergence(mixedelements, alpha) {

  const inv_r1 = mixedelements[0]['ranks'].map(d => Math.pow(d, -1))
  const inv_r2 = mixedelements[1]['ranks'].map(d => Math.pow(d, -1))
  
  const divergence_elements = divElems(inv_r1, inv_r2, alpha)
  const normalization = +norm_divElems(mixedelements, inv_r1, inv_r2, alpha).toPrecision(6)
  
  return {
    'divergence_elements': divergence_elements.map(d => +(d / normalization).toFixed(4)), 
    'normalization': normalization
  }
}