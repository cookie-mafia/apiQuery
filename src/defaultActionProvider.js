'use strict';

function logAndReturn(action) {
  let actionStr = action + ' is not supported.';
  console.log(actionStr);
  return actionStr;
}

function doFilter() {
  return logAndReturn('Filtering');
}

function doSort() {
  return logAndReturn('Sorting');
}

function doBatch() {
  return logAndReturn('Batch fetch');
}

function execute() {
  return logAndReturn('Execution');
}

module.exports = {
  doFilter,
  doSort,
  doBatch,
  execute
};
