(function(){
    'use strict';

    var lnp = angular.module('app.lnp');
    lnp.controller('lnpController', lnpController);

    lnpController.$inject = ['$http', 'lnps', 'lnpModel'];

    function lnpController($http, lnps, lnpModel){
        var vm = this;
        vm.lnps = lnps;
    }   
})();