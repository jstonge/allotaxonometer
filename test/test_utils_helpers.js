'use strict'

var assert = require('chai').assert;
import { 
  removeDuplicates as rmDups, 
  tiedrank as rank, 
  rin as rin, 
  matlab_sort as sort,
  dot as dot
 } from "../src/utils_helpers.js";

describe('suite of utility functions inside removeDuplicates', function () {
  describe('removing array duplicates', function () {
    it('should return unique values', function () {
        let myNums = [1,2,3,1,4,1,2,5,3,4];
        assert.deepEqual([1, 2, 3, 4, 5], rmDups(myNums));
      });
  });
})

describe('suite of utility functions inside tiedrank', function () {
  describe('rank values from large to smaller, taking average when ties', function () {
    it('should return rank with average when tied', function () {
        let myNums = [5, 4, 4, 3, 3, 2, 2, 1, 1, 1,];
        assert.deepEqual([1, 2.5, 2.5, 4.5, 4.5, 6.5, 6.5, 9, 9, 9], rank(myNums));
      });
  });
})

describe('suite of utility functions inside rin', function () {
  describe('Find element arr1 presents in arr2, i.e. arr1 %in% arr2', function () {
    it('should return boolean when found', function () {
        let myNames = ['John', 'Williams', 'James', 'Jesus'];
        assert.deepEqual([true, true], rin(['John', 'Williams'], myNames));
      });
  });
})

describe('suite of utility functions inside dot', function () {
  describe('It should take the dot product of vector a and b', function () {
    it('should return 25', function () {
        let a = [5,-5];
        let b = [5, 0];
        assert.deepEqual(25, dot(a, b));
      });
      it('should return 32', function () {
        let a = [1,2,3];
        let b = [4,5,6];
        assert.deepEqual(32, dot(a, b));
      });
      it('should return 2', function () {
        let a = [1,1];
        let b = [1,1];
        assert.deepEqual(2, dot(a, b));
      });
      it('should return 0', function () {
        let a = [0,0];
        let b = [0,0];
        assert.deepEqual(0, dot(a, b));
      });
  });
})

describe('suite of utility functions inside matlab_sort', function () {
  describe('Keep track of the original indices of an array after sorting', function () {
    it('should return ordered list', function () {
        let myNums = [5, 4, 1, 2, 3];
        assert.deepEqual([1,2,3,4,5], sort(myNums, false)['value']);
      });
    it('should return original index', function () {
        let myNums = [5, 4, 1, 2, 3];
        assert.deepEqual([2,3,4,1,0], sort(myNums, false)['orig_idx']);
      });
  });
})

