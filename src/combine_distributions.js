export default class mixedElems {
  constructor(elem1, elem2) {
    this.elem1 = elem1;
    this.elem2 = elem2;
  }

  getUnions() {
    let a = new Set(this.elem1.map(d=>d.types));
    let b = new Set(this.elem2.map(d=>d.types));
    return Array.from(new Set([...a, ...b])); 
  }

  unionLength() {
    return this.getUnions().length
  }

  buildMixedElems() {
    const mixedelem = [[], []]
    mixedelem[0]['types'] = this.getUnions(); 
    mixedelem[1]['types'] = this.getUnions();
    return mixedelem
  }

  buildEnumList() {
    return [this.elem1, this.elem2]
  }

  alignVals(elem, idx, new_idx, col) {
  // We want the following mapping: new_idx[i]=7 => idx[7]=10 => elem[10][col]
  return Array.from(idx, (d,i) => {
      return new_idx[i] === undefined ?  0 : elem[idx[new_idx[i]]][col]
    })
  }
  
  combElems() {
    const mixedelem = this.buildMixedElems()
    const enum_list = this.buildEnumList()
    
    for (let j=0; j < enum_list.length; j++) {
      // Where do types in system 1 ends up in system 2? e.g. James went 1 -> 18.
      const indices = match(mixedelem[j]["types"],  enum_list[j].map(d => d.types), 0)
      // Indices of types in mixed elem found exclusively in one of the 2 sets, e.g.
      // James is found and is now index=1 
      const new_indices = which(rin(mixedelem[j]["types"], enum_list[j].map(d=>d.types)))
      
      // Tricky part: 
      mixedelem[j]['counts']      = this.alignVals(enum_list[j], indices, new_indices, 'counts')
      mixedelem[j]['ranks']       = rank(mixedelem[j]['counts'])
      mixedelem[j]['probs']       = this.alignVals(enum_list[j], indices, new_indices, 'probs')
      mixedelem[j]['totalunique'] = this.alignVals(enum_list[j], indices, new_indices, 'totalunique')
    }
    return mixedelem
  }

  // tidy_count_mixedelem(mixedelements, alpha = Inf) {
  //   y1 = null
  //   dc = diamond_counts(mixedelements, alpha)
  //   counts_t = data.table::data.table(t(dc$counts))
  //   counts_t[, ("x1") := 1:nrow(counts_t)]
  //   counts_long = data.table::melt(counts_t, id.vars = "x1", variable.name = "y1")
  //   counts_long$y1 = as.integer(gsub("V", "", y1))
  //   return([counts_long=counts_long, divergence_score=dc$div_score, 
  //               deltas=dc$deltas, max_delta_loss=dc$max_delta_loss])
  // }
}