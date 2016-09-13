'use strict';

require('should');

const apiQuery = require('./index.js');

describe('attributes', () => {
  it('version check', () => {
    apiQuery.should.have.property('version');
  });
});
