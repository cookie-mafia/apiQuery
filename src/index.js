'use strict';

const defaultActions   = require('./defaultActionProvider.js');
const defaultOperators = [0, 1, 2];
const optr             = {
  'FILTER': 0,
  'SORT': 1,
  'BATCH': 2
};

function setActionProvider(actionProvider) {
  this.actions = actionProvider;
  return this;
}

function setAllowedOperators(operators) {
  this.allowedOperators = operators;
  return this;
}

function getActionProvider(options) {
  return options && options.actionProvider ||
    this.actions || defaultActions;
}

function getAllowedOperators(options) {
  return options && options.operators ||
    this.allowedOperators || defaultOperators;
}

function start(baseQuery, reqUrlParams, options) {
  let actions   = this.getActionProvider(options);
  let operators = this.getAllowedOperators(options);

  function removeUnusedOptrs(optr, index) {
    return operators.indexOf(index) > -1;
  }

  function executeEachOptr(baseQuery, optr) {
    return optr(baseQuery);
  }

  this.operators.filter(removeUnusedOptrs).reduce(executeEachOptr, {
    actions, baseQuery, reqUrlParams
  });

  return actions.execute();
}

function preFilter(baseQuery) {
  return baseQuery;
}

function preSort(baseQuery) {
  return baseQuery;
}

function getValue(base, attrib, def) {
  return base[attrib] || def;
}

function preBatch(pack) {
  const limitTxt  = 'limit';
  const offsetTxt = 'offset';

  function checkIfKeyIsPresent(key) {
    return key in pack.reqUrlParams;
  }

  function performBatch() {
    pack.baseQuery = pack.actions.doBatch(
      pack.baseQuery,
      getValue(pack.reqUrlParams, offsetTxt, 0),
      getValue(pack.reqUrlParams, limitTxt, 0)
    );
    return true;
  }

  [limitTxt, offsetTxt].filter(checkIfKeyIsPresent).some(performBatch);
  return pack;
}

module.exports = {
  'version': '1.0.0',

  'actions': defaultActions,
  'operators': [preFilter, preSort, preBatch],
  'allowedOperators': defaultOperators,

  optr,
  setActionProvider,
  setAllowedOperators,
  getActionProvider,
  getAllowedOperators,
  start
};
