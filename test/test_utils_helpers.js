'use strict'

var assert = require('chai').assert;
const rmDups = require("../src/utils_helpers").removeDuplicates;
const rank = require("../src/utils_helpers").tiedrank;

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