'use strict'

var assert = require('chai').assert;
import * as mixedElems from '../src/combine_distributions.js';

describe('suite of utility functions inside combine distributions', function () {
  describe('combining two systems', function () {
    it('types in elem1 should be the exact same than elem2', function () {
      
      let test_elem_1 = [
        {"types":"John","counts":9655,"probs":0.0874},
        {"types":"William","counts":9532,"probs":0.0863},      
        {"types":"James","counts":5927,"probs":0.0536},
        {"types":"Charles","counts":5348,"probs":0.0484},
        {"types":"George","counts":5126,"probs":0.0464},
        {"types":"Thomas","counts":2534,"probs":0.0229},
        {"types":"Henry","counts":2444,"probs":0.0221},
        {"types":"Robert","counts":2415,"probs":0.0219},
        {"types":"Jacques","counts":215,"probs":0.0219}
      ]
      let test_elem_2 = [
        {"types":"John","counts":8756,"probs":0.0812},
        {"types":"William","counts":8044,"probs":0.0746},
        {"types":"James","counts":5175,"probs":0.048},
        {"types":"George","counts":4674,"probs":0.0434},
        {"types":"Charles","counts":4599,"probs":0.0427},
        {"types":"Henry","counts":2406,"probs":0.0223},
        {"types":"Robert","counts":2322,"probs":0.0215},
        {"types":"Thomas","counts":2266,"probs":0.021},
        {"types":"Bob","counts":25,"probs":0.0219}  
      ]
        me_class_test = new mixedElems(test_elem_1, test_elem_2)
        mixed_elem_test = me_class_test.combElems()
        assert.deepEqual(mixed_elem_test[1]['types'], mixed_elem_test[0]['types']);
      });
  });
})
