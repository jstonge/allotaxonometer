import { descending } from "d3-array";

import combElems from './src/combine_distributions.js'
import rank_turbulence_divergence from './src/rank_turbulence_divergence.js'
import diamond_count from './src/diamond_count.js'

import { getUnions, setdiff, rin, matlab_sort, tiedrank, which, rank_maxlog10, zeros } from './src/utils_helpers.js'


function balanceDat(elem1, elem2) {
  const types_1 = elem1.map(d => d.types)
  const types_2 = elem2.map(d => d.types)
  
  const union_types = getUnions(types_1, types_2)
  const tot_types = types_1.length+types_2.length
  
  return [ 
    { y_coord: "total count",     frequency: +(types_2.length / tot_types).toFixed(3) },
    { y_coord: "total count",     frequency: -(types_1.length / tot_types).toFixed(3) },
    { y_coord: "all names",       frequency: +(types_2.length / union_types.size).toFixed(3) },
    { y_coord: "all names",       frequency: -(types_1.length / union_types.size).toFixed(3) },
    { y_coord: "exclusive names", frequency: +(setdiff(types_2, types_1).size / types_2.length).toFixed(3) },
    { y_coord: "exclusive names", frequency: -(setdiff(types_1, types_2).size / types_1.length).toFixed(3) } 
  ]
}
   
function wordShift_dat(me, dat) { 
  const out = []
  for (let i=0; i < me[0]['types'].length; i++) {
    const rank_diff = me[0]['ranks'][i]-me[1]['ranks'][i]
    out.push({
      'type': `${me[0]['types'][i]} (${me[0]['ranks'][i]} ⇋ ${me[1]['ranks'][i]})` ,
      'rank_diff': rank_diff,
      'metric': rank_diff < 0 ? -dat.deltas[i] : dat.deltas[i], 
    })
  }
  
  return out.slice().sort((a, b) => descending(Math.abs(a.metric), Math.abs(b.metric)))
}


export{
  rank_maxlog10,
  matlab_sort,
  which,
  rin,
  tiedrank,
  combElems, 
  rank_turbulence_divergence, 
  diamond_count, 
  wordShift_dat, 
  balanceDat,
  zeros
}