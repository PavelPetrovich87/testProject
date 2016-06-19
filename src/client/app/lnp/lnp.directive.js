(function(){
    'use strict';

    angular
      .module('app.lnp')
      .directive('lnp', lnp);

    /* @ngInject */
    function lnp() {
      var directive = {
        link: link,
        restrict: 'EA',
        scope: {
          name: '@',
          lastName: '@',
          city: '@',
          address: '@'
        },
        template: '<td>{{name}}</td> <td>{{lastName}}</td> <td>{{city}}</td> <td>{{address}} </td>'
      };
      return directive;

      function link(scope, element, attrs, parentCtrl) {
        
      }
    }

})();