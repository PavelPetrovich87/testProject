(function(){
    'use strict';

    var lnp = angular.module('app.lnp');
    lnp.controller('lnpController', lnpController);

    lnpController.$inject = ['$http', 'lnpService', 'lnps'];

    function lnpController($http, lnpService, lnps){
        var vm = this;

        vm.lnps = lnps;
    }   
})();