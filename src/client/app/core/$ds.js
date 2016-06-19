'use strict';
(function () {
  angular
    .module('app.core')
    .factory('$ds', $ds);

  $ds.$inject = ['config'];

  function $ds(config) {
    var service = {};
    service.WrapUrl = WrapUrl;
    return service;

    function WrapUrl(url, server) {
      //Perhaps not the best idea, but i have 2 servers to handle
        return config.servers[server] + url;
    }
  }
})();