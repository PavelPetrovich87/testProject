(function() {
  'use strict';

  angular
    .module('app.core', [
      'ngAnimate', 'ngSanitize',
      'blocks.exception', 'blocks.router',
      'ui.router', 'ngplus', 'core.logger',
      'core.auth', 'core.base'
    ]);
})();
