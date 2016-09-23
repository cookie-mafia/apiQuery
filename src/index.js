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

function getValue(base, attrib, def) {
  return base[attrib] || def;
}

function preBatch(pack) {
  const limitTxt  = 'limit';
  const offsetTxt = 'offset';

  function checkIfKeyIsPresent(key) {
    return key in pack.reqUrlParams && pack.reqUrlParams[key] && Number.isInteger(pack.reqUrlParams[key]);
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

function preSort(pack) {
  const sortText  = 'sort';
  const delimiter = ',';
  const asc       = '+';
  const desc      = '-';

  function checkIfKeyIsPresent(key) {
    return key in pack.reqUrlParams && pack.reqUrlParams[key];
  }

  function checkSortString(sortString) {
    return [asc,desc].indexOf(sortString[0]) > -1 && sortString.length > 1;
  }

  function performIndividualSort(prev, singleSortString) {
    prev.baseQuery = prev.actions.doSort(prev.baseQuery, singleSortString[0] === asc, singleSortString.substring(1));
    return prev;
  }

  function performSort() {
    pack.baseQuery = pack
      .reqUrlParams[sortText]
      .split(delimiter)
      .filter(checkSortString)
      .reduce(performIndividualSort, pack).baseQuery;
    return true;
  }

  [sortText].filter(checkIfKeyIsPresent).some(performSort);
  return pack;
}

function preFilter(pack) {
  const filterPrefix = 'fltr_';

  function filterFltr(key) {
    return key.indexOf(filterPrefix) > -1;
  }

  function performFilter(prev, key) {
    prev.baseQuery = prev.actions.doFilter(prev.baseQuery, key.replace(filterPrefix, ''), prev.reqUrlParams[ key ]);
    return prev;
  }

  pack.baseQuery = Object.keys(pack.reqUrlParams).filter(filterFltr).reduce(performFilter, pack).baseQuery;
  return pack;
}

function wrapPreFilter(filters) {
  function addPrefixToKey(prev, key) {
    prev['fltr_' + key] = filters[key];
    return prev;
  }

  return Object.keys(filters).reduce(addPrefixToKey, {});
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

  preFilter({
    actions,
    baseQuery,
    'reqUrlParams': wrapPreFilter(options && options.preFilter || {})
  });

  return actions.execute(baseQuery);
}

module.exports = {
  'version': '1.1.0',

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
