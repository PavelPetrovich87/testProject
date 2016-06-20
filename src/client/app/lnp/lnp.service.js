(function(){
    'use strict';

    angular.module('app.lnp')
        .factory('lnpService', LnpService);

        LnpService.$inject = ['BaseService', '$q'];

        function LnpService(BaseService, $q){
            var lnpService = function(){

            };


            lnpService.prototype = new BaseService();


            lnpService.prototype.activate = function(){
              var self = this;

              return self;
            };

            lnpService.prototype.getMessageCount = function(){
               return $q.when(10);
            };

            var instance = new lnpService();

            instance.Init(
              '/lnprequests', /* Api Url */
              'lnp', /* Model Name */
              'lnpServer',
              true, /* Is Array*/
              {caching: true, duration: 0, durationList: 60} /* Enable caching, set expiry duration */
              );

            return instance.activate();
            
        }
})();