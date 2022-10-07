(() => {
  // src/utils_helpers.js
  function removeDuplicates(arr) {
    if (!Array.isArray(arr)) {
      arr = [];
    }
    let theSet = new Set(arr);
    let uniqueArr = [...theSet];
    return uniqueArr;
  }
})();
