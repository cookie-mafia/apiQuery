'use strict';

require('should');
const should = require('should/as-function');

const apiQuery        = require('./index.js');
const testProviderStr = 'dummy action provider';
const testOperators   = [apiQuery.optr.SORT, apiQuery.optr.FILTER];

const testProvider = {
  execute() {
    return testProviderStr;
  }
};

const optionsAP = {
  'actionProvider': testProvider,
  'operators': []
};

const optionsOptr = {
  'operators': testOperators
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
    apiQuery.start('', {}, optionsAP).should.equal(testProviderStr);
  });

  it('should be able to use last actionProvider set on apiQuery.start', () => {
    apiQuery.setActionProvider(testProvider);
    apiQuery.setAllowedOperators(optionsAP.operators);
    apiQuery.start('', {}).should.equal(testProviderStr);
  });

  it('should be able to set which operators to execute', () => {
    apiQuery.setAllowedOperators(testOperators);
    apiQuery.allowedOperators.should.equal(testOperators);
  });

  it('should be able to override operators on apiQuery.start', () => {
    apiQuery.start('', {}, optionsOptr).should.equal(testProviderStr);
  });

  it('should be able to defer to app defauls when custom options fail', () => {
    apiQuery.setAllowedOperators(null);
    apiQuery.setActionProvider(null);
    should(apiQuery.getAllowedOperators()).be.ok();
    should(apiQuery.getActionProvider()).be.ok();
  });
});

describe('actions', () => {
  describe('batch', () => {
    it('should not be able to extract limits and offset from request url params when batch is not included in allowed operators even when present', () => {
      let limit          = 0;
      let offset         = 0;
      let actionProvider = {
        'doBatch': (bq, limitParam, offsetParam) => {
          limit  = limitParam;
          offset = offsetParam;
        },
        'execute': () => {}
      };

      apiQuery.setAllowedOperators([]);
      apiQuery.setActionProvider(actionProvider);
      apiQuery.start('', {'limit': 25, 'offset': 24});
      limit.should.equal(0);
      offset.should.equal(0);
    });

    it('should not be able to trigger batch action when batch is included in allowed operators but params has no limit or offset', () => {
      let callCount      = 0;
      let actionProvider = {
        'doBatch': () => {
          callCount += 1;
        },
        'execute': () => {}
      };

      apiQuery.setAllowedOperators([apiQuery.optr.BATCH]);
      apiQuery.setActionProvider(actionProvider);
      apiQuery.start('', {});
      callCount.should.equal(0);
    });

    it('should be able to extract limits and offset from request url params when batch is included in allowed operators when present', () => {
      let limit          = 0;
      let offset         = 0;
      let actionProvider = {
        'doBatch': (bq, offsetParam, limitParam) => {
          limit  = limitParam;
          offset = offsetParam;
        },
        'execute': () => {}
      };

      apiQuery.setAllowedOperators([apiQuery.optr.BATCH]);
      apiQuery.setActionProvider(actionProvider);
      apiQuery.start('', {'limit': 25, 'offset': 24});
      limit.should.equal(25);
      offset.should.equal(24);
    });

    it('should be able to extract limits from request url params and provide default value to offset', () => {
      let limit          = 0;
      let offset         = 24;
      let actionProvider = {
        'doBatch': (bq, offsetParam, limitParam) => {
          limit  = limitParam;
          offset = offsetParam;
        },
        'execute': () => {}
      };

      apiQuery.setAllowedOperators([apiQuery.optr.BATCH]);
      apiQuery.setActionProvider(actionProvider);
      apiQuery.start('', {'limit': 25});
      limit.should.equal(25);
      offset.should.equal(0);
    });

    it('should be able to extract offset from request url params and provide default value to limit', () => {
      let limit          = 25;
      let offset         = 0;
      let actionProvider = {
        'doBatch': (bq, offsetParam, limitParam) => {
          limit  = limitParam;
          offset = offsetParam;
        },
        'execute': () => {}
      };

      apiQuery.setAllowedOperators([apiQuery.optr.BATCH]);
      apiQuery.setActionProvider(actionProvider);
      apiQuery.start('', {'offset': 24});
      limit.should.equal(0);
      offset.should.equal(24);
    });
  });

  describe('sort', () => {
    it('should not be able to extract sort fields from request url params when sort is not included in allowed operators even when present', () => {
      let isAsc          = false;
      let field          = '';
      let actionProvider = {
        'doSort': (bq, isAscParam, fieldParam) => {
          isAsc = isAscParam;
          field = fieldParam;
        },
        'execute': () => {}
      };

      apiQuery.setAllowedOperators([]);
      apiQuery.setActionProvider(actionProvider);
      apiQuery.start('', {'sort': '-dummy.field'});
      isAsc.should.equal(false);
      field.should.equal('');
    });

    it('should not be able to trigger sort check when sort is included in allowed operators but params has no sort field', () => {
      let callCount      = 0;
      let actionProvider = {
        'doSort': () => {
          callCount += 1;
        },
        'execute': () => {}
      };

      apiQuery.setAllowedOperators([apiQuery.optr.SORT]);
      apiQuery.setActionProvider(actionProvider);
      apiQuery.start('', {});
      callCount.should.equal(0);
    });

    it('should be able to extract sort info from request url params when sort is included in allowed operators when present', () => {
      let isAsc          = false;
      let field          = '';
      let actionProvider = {
        'doSort': (bq, isAscParam, fieldParam) => {
          isAsc = isAscParam;
          field = fieldParam;
        },
        'execute': () => {}
      };

      apiQuery.setAllowedOperators([apiQuery.optr.SORT]);
      apiQuery.setActionProvider(actionProvider);
      apiQuery.start('', {'sort': '+dummy.field'});
      isAsc.should.equal(true);
      field.should.equal('dummy.field');
    });
  });
});
