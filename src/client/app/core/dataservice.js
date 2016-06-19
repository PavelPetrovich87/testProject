(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('dataservice', Dataservice);

  Dataservice.$inject = ['$http', '$q', 'exception', 'logger', 'BaseService'];
  /* @ngInject */
  function Dataservice($http, $q, exception, logger, BaseService) {
      
    var dataservice = function(){

    };


    dataservice.prototype = new BaseService();


    dataservice.prototype.activate = function(){
      var self = this;

      return self;
    };

    dataservice.prototype.getMessageCount = function(){
       return $q.when(10);
    };

    var instance = new dataservice();

    instance.Init(
      '/api/people', /* Api Url */
      'lnp', /* Model Name */
      'peopleServer', /*ServerName*/
      true, /* Is Array*/
      {caching: true, duration: 0, durationList: 60} /* Enable caching, set expiry duration */
      );

    return instance.activate();

  }
})();
