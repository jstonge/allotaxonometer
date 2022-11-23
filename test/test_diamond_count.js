'use strict'

var assert = require('chai').assert;
import { diamond } from "../src/diamond_count";
import { mixedElems } from '../src/combine_distributions.js';
import { test_elem_1, test_elem_2 } from './test_data.js'
import { sum } from '../src/utils_helpers'


describe('suite of utility functions inside diamond counts', function () {
  const me_class_test = new mixedElems(test_elem_1, test_elem_2);
  const mixed_elem_test = me_class_test.combElems();
  describe('counts for diamond plot', function () {
    const dc = diamond(mixed_elem_test, Infinity)

    it('should return the same div_score', function () {
        assert.deepEqual(0.3822, +(dc.div_score).toFixed(7));
      });

      // it('should return 4', function () {
        // assert.deepEqual(62, sum(dc.counts[39]));
      // });
  });
})

