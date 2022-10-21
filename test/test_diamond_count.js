'use strict'

var assert = require('chai').assert;
import { diamond_counts as diamond_counts } from "../src/diamond_count";
import { mixedElems } from '../src/combine_distributions.js';
import {test_elem_1, test_elem_2} from './test_data.js'


describe('suite of utility functions inside diamond counts', function () {
  describe('counts for diamond plot', function () {
    it('should return the same div_score', function () {
        const me_class_test = new mixedElems(test_elem_1, test_elem_2);
        const mixed_elem_test = me_class_test.combElems();
        const dc = diamond_counts(mixed_elem_test, Infinity)
        assert.deepEqual(0.3822, +(dc.div_score).toFixed(7));
      });
  });
})