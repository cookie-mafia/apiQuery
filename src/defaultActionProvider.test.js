'use strict';

const should      = require('should/as-function');
const defProvider = require('./defaultActionProvider.js');

describe('attributes', () => {
  it('should have doFilter attribute', () => {
    should(defProvider.doFilter()).equal('Filtering is not supported.');
  });

  it('should have doSort attribute', () => {
    should(defProvider.doSort()).equal('Sorting is not supported.');
  });

  it('should have doBatch attribute', () => {
    should(defProvider.doBatch()).equal('Batch fetch is not supported.');
  });

  it('should have execute attribute', () => {
    should(defProvider.execute()).equal('Execution is not supported.');
  });
});
