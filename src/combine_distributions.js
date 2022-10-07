function align_vals(elem, idx, new_idx, col) {
  // We want the following mapping: new_idx[i]=7 => idx[7]=10 => elem[10][col]
  return Array.from(idx, (d,i) => {
      return new_idx[i] === undefined ?  0 : elem[idx[new_idx[i]]][col]
    })
}

export default function combine_distributions(elem1, elem2) {
  const union_types = union(elem1.map(d => d.types), elem2.map(d => d.types))
  const N = union_types.length
          
  const mixedelem = [[], []]
  mixedelem[0]['types'] = Array.from(union_types); 
  mixedelem[1]['types'] = Array.from(union_types); 

  const enum_list = [elem1, elem2]

  for (let j=0; j < enum_list.length; j++) {
    // Where do types in system 1 ends up in system 2? e.g. James went 1 -> 18.
    const indices = match(mixedelem[j]["types"],  enum_list[j].map(d => d.types), 0)
    // Indices of types in mixed elem found exclusively in one of the 2 sets, e.g.
    // James is found and is now index=1 
    const new_indices = which(rin(mixedelem[j]["types"], enum_list[j].map(d=>d.types)))
    
    // Tricky part: 
    mixedelem[j]['counts']      = align_vals(enum_list[j], indices, new_indices, 'counts')
    mixedelem[j]['ranks']       = rank(mixedelem[j]['counts'])
    mixedelem[j]['probs']       = align_vals(enum_list[j], indices, new_indices, 'probs')
    mixedelem[j]['totalunique'] = align_vals(enum_list[j], indices, new_indices, 'totalunique')
  }
  
  return(mixedelem)
}
