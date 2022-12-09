import { dot, rin, sum, matlab_sort, removeDuplicates, tiedrank, which, rank_maxlog10, zeros } from './src/utils_helpers'
import { mixedElems } from './src/combine_distributions'
import { diamond } from './src/diamond_count'
import { get_entropy_scores, get_jsd_scores } from './src/entropy'
import rank_turbulence_divergence from './src/rank_turbulence_divergence'


export{
  diamond,
  dot,
  get_entropy_scores, 
  get_jsd_scores,
  rank_turbulence_divergence,
  rank_maxlog10,
  removeDuplicates,
  matlab_sort,
  which,
  rin,
  tiedrank,
  sum,
  mixedElems,
  zeros
}