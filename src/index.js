'use strict';

const defaultActions   = require('./defaultActionProvider.js');
const defaultOperators = [0, 1, 2];
const optr             = {
  'FILTER': 0,
  'SORT': 1,
  'BATCH': 2
};

function setProp(key, value) {
  this[key] = value;
  return this;
}

function getProp(prop, options, key, def) {
  return options && options[key] || this[prop] || def;
}

function attrib(options, key, def) {
  return this.getProp(key, options, key, def);
}

function setActionProvider(actionProvider) {
  return this.setProp('actions', actionProvider);
}

function setAllowedOperators(operators) {
  return this.setProp('allowedOperators', operators);
}

function getActionProvider(options) {
  return this.getProp('actions', options, 'actionProvider', defaultActions);
}

function getAllowedOperators(options) {
  return this.getProp('allowedOperators', options, 'operators', defaultOperators);
}

function getValue(base, attrib, def) {
  return base[attrib] || def;
}

function preBatch(pack) {
  const limitKey  = pack.baseUtil.attrib(pack.options, 'limitKey', 'limit');
  const offsetKey = pack.baseUtil.attrib(pack.options, 'offsetKey', 'offset');

  function checkIfKeyIsPresent(key) {
    return key in pack.reqUrlParams && pack.reqUrlParams[key] && Number.isInteger(pack.reqUrlParams[key]);
  }

  function performBatch() {
    pack.baseQuery = pack.actions.doBatch(
      pack.baseQuery,
      getValue(pack.reqUrlParams, offsetKey, 0),
      getValue(pack.reqUrlParams, limitKey, 0)
    );
    return true;
  }

  [limitKey, offsetKey].filter(checkIfKeyIsPresent).some(performBatch);
  return pack;
}

function preSort(pack) {
  const sortKey       = pack.baseUtil.attrib(pack.options, 'sortKey', 'sort');
  const sortDelimiter = pack.baseUtil.attrib(pack.options, 'sortDelimiter', ',');
  const sortAscKey    = pack.baseUtil.attrib(pack.options, 'sortAscKey', '+');
  const sortDescKey   = pack.baseUtil.attrib(pack.options, 'sortAscKey', '-');

  function checkIfKeyIsPresent(key) {
    return key in pack.reqUrlParams && pack.reqUrlParams[key];
  }

  function checkSortString(sortString) {
    return [sortAscKey, sortDescKey].indexOf(sortString[0]) > -1 && sortString.length > 1;
  }

  function performIndividualSort(prev, singleSortString) {
    prev.baseQuery = prev.actions.doSort(prev.baseQuery, singleSortString[0] === sortAscKey, singleSortString.substring(1));
    return prev;
  }

  function performSort() {
    pack.baseQuery = pack
      .reqUrlParams[sortKey]
      .split(sortDelimiter)
      .filter(checkSortString)
      .reduce(performIndividualSort, pack).baseQuery;
    return true;
  }

  [sortKey].filter(checkIfKeyIsPresent).some(performSort);
  return pack;
}

function preFilter(pack) {
  const filterPrefix = pack.baseUtil.attrib(pack.options, 'filterPrefix', 'fltr_');

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

function wrapPreFilter(filters, filterPrefix) {
  function addPrefixToKey(prev, key) {
    prev[filterPrefix + key] = filters[key];
    return prev;
  }

  return Object.keys(filters).reduce(addPrefixToKey, {});
}

function start(baseQuery, reqUrlParams, options) {
  let actions   = this.getActionProvider(options);
  let operators = this.getAllowedOperators(options);
  let baseUtil  = this;

  function removeUnusedOptrs(optr, index) {
    return operators.indexOf(index) > -1;
  }

  function executeEachOptr(baseQuery, optr) {
    return optr(baseQuery);
  }

  this.operators.filter(removeUnusedOptrs).reduce(executeEachOptr, {
    actions, baseQuery, reqUrlParams, options, baseUtil
  });

  preFilter({
    actions, baseQuery, options, baseUtil,
    'reqUrlParams': wrapPreFilter(
      options && options.preFilter || {},
      this.attrib(options, 'filterPrefix', 'fltr_')
    )
  });

  return actions.execute(baseQuery);
}

module.exports = {
  'version': '1.1.1',

  'actions': defaultActions,
  'operators': [preFilter, preSort, preBatch],
  'allowedOperators': defaultOperators,

  optr,
  setActionProvider,
  setAllowedOperators,
  getActionProvider,
  getAllowedOperators,
  start,

  setProp,
  getProp,
  attrib
};
