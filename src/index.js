'use strict';

function setActionProvider(actionProvider) {
  this.actions = actionProvider;
}

function start(overriderActionProvider) {
  let actions = overriderActionProvider || this.actions;

  return actions.execute();
}

module.exports = {
  'version': '1.0.0',
  'actions': require('./defaultActionProvider.js'),
  setActionProvider,
  start
};
