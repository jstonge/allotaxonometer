export { matlab_sort, rin, rank_maxlog10, tiedrank, which, zeros, getUnions, setdiff, balanceDat, wordShift_dat } ;

import { descending } from "d3-array";

// Takes arrays, returns a Set object containing the union of both arrays
 function getUnions(x,y) {
  let a = new Set(x); // convert array x to a Set object
  let b = new Set(y); // convert array y to a Set object
  return new Set([...a, ...b]); // return a new Set object containing the union of a and b
}

// Takes arrays, returns a Set object
function setdiff(x,y) {
  let a = new Set(x); // convert array x to a Set object
  let b = new Set(y); // convert array y to a Set object
  // return a new Set object containing elements in a that are not present in b
  return new Set(       
    [...a].filter(x => !b.has(x)));
} 

function which(x) {
  // Which indices are TRUE?
  // Description:
  //   Give the ‘TRUE’ indices of a logical object, allowing for array indices.
  // Arguments:
  //   x: a ‘logical’ vector or array.
  return x.reduce(
      (out, bool, index) => bool ? out.concat(index) : out, 
      []
    )
}


function matlab_sort(A, rev) {
  // Inspired by matlab, this functions keep track of the original indices of an array after sorting.
  // Returns both the sorted vector `v` and the original indices.
  //
  // examples 
  // A = [5, 4, 1, 2, 3]
  // ([1, 2, 3, 3, 4, 5], [3, 4, 5, 6, 2, 1])
  
  let sorted = rev ? A.slice().sort((a, b) => b - a) : A.slice().sort((a, b) => a - b)

  const A_cp = A.slice()
  const orig_idx = []
  for (let i = 0; i < A.length; ++i) {
    orig_idx.push(A_cp.indexOf(sorted[i]))
    delete A_cp[A_cp.indexOf(sorted[i])]
  }
  
  return {'value': sorted, 'orig_idx': orig_idx}
}

function tiedrank(arr) {
  // tiedrank(X) computes the ranks of the values in the vector X. If any X values are tied, tiedrank computes their average rank. Same as in matlab.
  function getIndex(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
           indexes.push(i+1);
    return indexes.reduce((a, b) => a + b) / indexes.length;
  }
  
  const sorted = arr.slice().sort((a, b) => b - a)
  return arr.map(e => getIndex(sorted, e))
}

function rank_maxlog10(mixedelements) {
  // Get maximum of log10 ranks from both systems, then round up
  let logged_max = [
    Math.max(...mixedelements[[0]].ranks), Math.max(...mixedelements[[1]].ranks)
  ].map(Math.log10)
  return Math.ceil(Math.max(...[logged_max[0], logged_max[1]]))
}

function rin(arr1, arr2) {
  // Find element arr1 presents in arr2, i.e. arr1 %in% arr2
  //
  // examples
  // A = ["bob", "george", "jesus"]
  // B = ["bob", "jesus", "terrence"]
  // rin(A, B)
  // [true, false, true]
  return Array.from(arr1, (x) => {
    return arr2.indexOf(x) == -1 ? false : true
  })
}

function zeros(length){
  // Create array of all zeros. Similar to matlab.
  function createArray(length) {
    var arr = new Array(length || 0),
        i = length;
    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }
    return arr;
  }
  let empty_mat = createArray(length,length)
  return Array.from(empty_mat, arr => arr.fill(0))
}

// helpers to wrangle data for the balance plot
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
   
// helper to wrangle the data for the wordshift plot
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


