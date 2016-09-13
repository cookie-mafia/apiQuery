'use strict';

require('should');

const apiQuery        = require('./index.js');
const testProviderStr = 'dummy action provider';
const testProvider    = {
  execute() {
    return testProviderStr;
  }
};

describe('attributes', () => {
  it('version check', () => {
    apiQuery.should.have.property('version');
  });
});

describe('methods', () => {
  it('should be able to register a new actionProvider', () => {
    apiQuery.setActionProvider(testProviderStr);
    apiQuery.actions.should.equal(testProviderStr);
  });

  it('should be able to override actionProvider on apiQuery.start', () => {
    apiQuery.start(testProvider).should.equal(testProviderStr);
  });

  it('should be able to use last actionProvider set on apiQuery.start', () => {
    apiQuery.setActionProvider(testProvider);
    apiQuery.start().should.equal(testProviderStr);
  });
});
