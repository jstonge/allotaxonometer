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

  alignVals(elem, enumlist, col) {
    return Array.from(elem['types'], type => {
      let idx_type_enumlist_in_elem = enumlist.map(d => d.types).indexOf(type)
      return idx_type_enumlist_in_elem === -1 ? 0 : enumlist[idx_type_enumlist_in_elem][col]
    })
  }
  
  combElems() {
    const mixedelem = this.buildMixedElems()
    const enum_list = this.buildEnumList()
    
    for (let j=0; j < enum_list.length; j++) {
      // Tricky part: 
      mixedelem[j]['counts']      = this.alignVals(mixedelem[j], enum_list[j], 'counts')
      mixedelem[j]['ranks']       = tiedrank(mixedelem[j]['counts'])
      mixedelem[j]['probs']       = this.alignVals(mixedelem[j], enum_list[j], 'probs')
      mixedelem[j]['totalunique'] = this.unionLength()
    }
    return mixedelem
  }
}
