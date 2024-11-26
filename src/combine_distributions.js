import { tiedrank, getUnions } from "./utils_helpers.js";

// Builds a mixed element array containing the union of types in elem1 and elem2
function buildMixedElems(elem1, elem2) {
   const mixedelem = [[], []]
   const x = elem1.map(d=>d.types)  // extract types from elem1
   const y = elem2.map(d=>d.types) // extract types from elem
   const union = Array.from(getUnions(x,y)) // get the union of x and y
   mixedelem[0]['types'] = union; // store union in mixedelem array for elem1
   mixedelem[1]['types'] = union; // store union in mixedelem array for elem2
   return mixedelem // return mixedelem array
 }
 
// Combine elements and return a combined array containing counts, ranks, probs, and totalunique
export default function combElems(elem1, elem2) {
   const mixedelem = buildMixedElems(elem1, elem2)  // build mixed elements array
   const enum_list = [elem1, elem2] // list containing elem1 and elem2

   for (let j=0; j < enum_list.length; j++) {
     const enumlist_types = enum_list[j].map(d => d.types) // extract types from enum_list[j]
     const counts = new Array(mixedelem[j]['types'].length) // initialize counts array
     const probs = new Array(mixedelem[j]['types'].length)  // initialize probs array

    
     // for each index in mixed elem[j], which is the union of both systems
     for (let i=0; i < mixedelem[j]['types'].length; i++) {  // find the index of type mixedelem[j]['types'][i] in system 1 or 2
       // find the index of type mixedelem[j]['types'][i] in system 1 or 2
       let idx_type_enumlist_in_elem = enumlist_types.indexOf(mixedelem[j]['types'][i])
       // if it exists, grabs counts and probs information else put a 0.
       counts[i] = idx_type_enumlist_in_elem === -1 ? 0 : enum_list[j][idx_type_enumlist_in_elem]["counts"]
       probs[i]  = idx_type_enumlist_in_elem === -1 ? 0 : enum_list[j][idx_type_enumlist_in_elem]["probs"]
     }
     
     
     // store counts, ranks, probs, and totalunique in mixedelem array for elem1 or elem2   
     mixedelem[j]['counts']      = counts
     mixedelem[j]['ranks']       = tiedrank(mixedelem[j]['counts'])
     mixedelem[j]['probs']       = probs
     mixedelem[j]['totalunique'] = getUnions().length

   }

   return mixedelem  // return mixedelem array
 }