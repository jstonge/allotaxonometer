export { removeDuplicates, match, which, rank, rin } ;

let uniqueArr = []
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

function rank(arr) {
  // Rank with respect to size, no reverse option.
  // Arguments:
  //   arr: an array.
  const sorted = arr.slice().sort((a, b) => b - a)
  const ranks = arr.map(v => sorted.indexOf(v) + 1);
  return ranks
}

function rin(arr1, arr2) {
  // Find element arr1 presents in arr2, i.e. arr1 %in% arr2
  return Array.from(arr1, (x) => {
    return _.includes(arr2, x)
  })
}

function union(x, y) {
  // Union of two arrays.
  // Return an array
  let a = new Set(x);
  let b = new Set(y);
  return Array.from(new Set([...a, ...b])); 
}


