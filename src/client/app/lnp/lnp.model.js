(function(){
    'use strict';

    angular.module('app.lnp')
        .factory('lnpModel', LnpModel);

        LnpModel.$inject = ['BaseService'];

        function LnpModel(BaseService){
            var lnpModel = function(){

            };


            lnpModel.prototype = new BaseService();


            lnpModel.prototype.activate = function(){
              var self = this;

              return self;
            };

            lnpModel.prototype.getMessageCount = function(){
               return $q.when(10);
            };

            var instance = new lnpModel();

            instance.Init(
              '/lnprequests', /* Api Url */
              'lnp', /* Model Name */
              'lnpServer',
              true, /* Is Array*/
              {caching: true, duration: 0, durationList: 60} /* Enable caching, set expiry duration */
              )

            return instance.activate();
            
        }
})()