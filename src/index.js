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
  return options && options.overrideActionProvider ||
    this.actions || defaultActions;
}

function getAllowedOperators(options) {
  return options && options.overrideOperators ||
    this.allowedOperators || defaultOperators;
}

function start(options) {
  let actions   = this.getActionProvider(options);
  let operators = this.getAllowedOperators(options);

  function removeUnusedOptrs(optr, index) {
    return operators.indexOf(index) > -1;
  }

  function executeEachOptr(baseQuery, optr) {
    return optr(baseQuery);
  }

  this.operators.filter(removeUnusedOptrs).reduce(executeEachOptr, {});

  return actions.execute();
}

function preFilter(baseQuery) {
  return baseQuery;
}

function preSort(baseQuery) {
  return baseQuery;
}

function preBatch(baseQuery) {
  return baseQuery;
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
