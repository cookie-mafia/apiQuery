'use strict';

require('should');
const should = require('should/as-function');

const apiQuery        = require('./index.js');
const testProviderStr = 'dummy action provider';
const testOperators   = [apiQuery.optr.SORT, apiQuery.optr.BATCH];

const testProvider = {
  execute() {
    return testProviderStr;
  }
};

const optionsAP = {
  'overrideActionProvider': testProvider
};

const optionsOptr = {
  'overrideOperators': testOperators
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
    apiQuery.start(optionsAP).should.equal(testProviderStr);
  });

  it('should be able to use last actionProvider set on apiQuery.start', () => {
    apiQuery.setActionProvider(testProvider);
    apiQuery.start().should.equal(testProviderStr);
  });

  it('should be able to set which operators to execute', () => {
    apiQuery.setAllowedOperators(testOperators);
    apiQuery.allowedOperators.should.equal(testOperators);
  });

  it('should be able to override operators on apiQuery.start', () => {
    apiQuery.start(optionsOptr).should.equal(testProviderStr);
  });

  it('should be able to defer to app defauls when custom options fail', () => {
    apiQuery.setAllowedOperators(null);
    apiQuery.setActionProvider(null);
    should(apiQuery.getAllowedOperators()).be.ok();
    should(apiQuery.getActionProvider()).be.ok();
  });
});
