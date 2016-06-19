(function(){
    'use strict';

    var lnp = angular.module('app.lnp');

    lnp.run(lnpRun);

    lnpRun.$inject = ['routerHelper'];

    function lnpRun(routerHelper){
        routerHelper.configureStates(getStates());
    }

    function getStates() {
      return [
        {
          state: 'lnp',
          config: {
            url: '/lnp',
            templateUrl: 'app/lnp/lnp.html',
            controller: 'lnpController',
            controllerAs: 'vm',
            title: 'lnp',
            settings: {
              nav: 4,
              content: '<i class="fa"></i> LNP',
              roles: ['Reseller']
            },
            resolve: {
                         lnps:['lnpModel', function(lnpModel){
                            return lnpModel.GetList();
                         }] 
                     } 
          }
        }
      ];
    }
})()