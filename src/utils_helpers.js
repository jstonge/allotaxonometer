export { match, matlab_sort, rin, sum, removeDuplicates, rank_maxlog10, tiedrank, which } ;
import { includes } from 'lodash';

function match(arr1, arr2, nomatch) {
  // Match arr1 and arr2 value, like ismember() in matlab.
  return Array.from(arr1, (d) =>  { 
    let idx_arr1_from_arr2 = arr2.indexOf(d)
    return idx_arr1_from_arr2 != -1 ? idx_arr1_from_arr2 : nomatch
  } )
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
  // A <- c(5, 4, 1, 2, 3)
  // ([1, 2, 3, 4, 5], [3, 4, 5, 2, 1])
  let sorted = rev ? A.slice().sort((a, b) => b - a) : A.slice().sort((a, b) => a - b)
  return {'value': sorted, 'orig_idx': sorted.map(e => A.indexOf(e)+1)}
}

function removeDuplicates(arr) {
  
  // Accepts an array from which the duplicates
  // will be removed
  if (!Array.isArray(arr)){
    arr = []
  }

  let theSet = new Set(arr)
  let uniqueArr = [...theSet]

  return uniqueArr
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
  return Array.from(arr1, (x) => {
    return includes(arr2, x)
  })
}

function sum(arr) {
  return arr.reduce((partialSum, a) => partialSum + a, 0);
}