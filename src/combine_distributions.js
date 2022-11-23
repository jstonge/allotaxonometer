export { mixedElems };
import { tiedrank } from './utils_helpers.js';

class mixedElems {
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
  
  combElems() {
    const mixedelem = this.buildMixedElems() 
    const enum_list = this.buildEnumList()   

    for (let j=0; j < enum_list.length; j++) {
      const enumlist_types = enum_list[j].map(d => d.types)
      const counts = new Array(mixedelem[j]['types'].length)
      const probs = new Array(mixedelem[j]['types'].length)

      // for each index in mixed elem[j], which is the union of both systems
      for (let i=0; i < mixedelem[j]['types'].length; i++) {
        // find the index of type mixedelem[j]['types'][i] in system 1 or 2
        let idx_type_enumlist_in_elem = enumlist_types.indexOf(mixedelem[j]['types'][i])
        // if it exists, grabs counts and probs information else put a 0.
        counts[i] = idx_type_enumlist_in_elem === -1 ? 0 : enum_list[j][idx_type_enumlist_in_elem]["counts"]
        probs[i]  = idx_type_enumlist_in_elem === -1 ? 0 : enum_list[j][idx_type_enumlist_in_elem]["probs"]
      }
      
      mixedelem[j]['counts']      = counts
      mixedelem[j]['ranks']       = tiedrank(mixedelem[j]['counts'])
      mixedelem[j]['probs']       = probs
      mixedelem[j]['totalunique'] = this.unionLength()
      
    }

  return mixedelem
  }
}
