import { rank_turbulence_divergence } from './rank_turbulence_divergence';

export default function diamond_counts(mixedelements, alpha) {
  
  let rank_turbulence = rank_turbulence_divergence(mixedelements, alpha)
  let deltas = rank_turbulence.divergence_elements
  let divergence_score = utils.sum(deltas)
  let sorted_div = matlab_sort(deltas, true)
  let indices_deltas = sorted_div.orig_idx
 
  deltas = indices_deltas.map(e => deltas[e])

  mixedelements[0]['types']  =  indices_deltas.map(i => mixedelements[0]['types'][i])  
  mixedelements[0]['counts']  =  indices_deltas.map(i => mixedelements[0]['counts'][i])
  mixedelements[0]['ranks']  =  indices_deltas.map(i => mixedelements[0]['ranks'][i])
  mixedelements[0]['probs'] =  indices_deltas.map(i => mixedelements[0]['probs'][i])
    
  mixedelements[1]['types']  =  indices_deltas.map(i => mixedelements[1]['types'][i])
  mixedelements[1]['counts']  =  indices_deltas.map(i => mixedelements[1]['counts'][i])
  mixedelements[1]['ranks']  =  indices_deltas.map(i => mixedelements[1]['ranks'][i])
  mixedelements[1]['probs'] =  indices_deltas.map(i => mixedelements[1]['probs'][i])

  
  const deltas_loss = structuredClone(deltas)
  const deltas_gain = structuredClone(deltas)

  utils.which(bar[0]['ranks'].map((d,i) => bar[0]['ranks'][i] > bar[1]['ranks'][i])).map(e => deltas_loss[e] = -1)
  utils.which(bar[0]['ranks'].map((d,i) => bar[1]['ranks'][i] < bar[1]['ranks'][i])).map(e => deltas_gain[e] = -1)
  

  const minlog10 = 0 // always for ranks
  const maxlog10 = rank_maxlog10(mixedelements)

  // for too small data sets
  if (maxlog10 < 1) {
    maxlog10 = 1
  }

  const CELL_LENGTH = 1/15
  const Ncells = Math.floor(maxlog10/CELL_LENGTH) + 1            
                                 
  const x1_indices = mixedelements[0]['ranks'].map(e => Math.floor(Math.log10(e)/CELL_LENGTH))
  const x2_indices = mixedelements[1]['ranks'].map(e => Math.floor(Math.log10(e)/CELL_LENGTH))

  
  const counts = zeros(Ncells, Ncells)
  for (let i = 0; i < mixedelements[0]['ranks'].length; ++i) {
    ++counts[x1_indices[i]][x2_indices[i]]
  }

  return({'counts':counts, 'div_score': divergence_score, 'deltas':deltas, 'max_delta_loss': Math.max(...deltas_loss)})
}