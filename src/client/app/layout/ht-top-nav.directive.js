(function() {
  'use strict';

  angular
    .module('app.layout')
    .directive('htTopNav', htTopNav);

  /* @ngInject */
  function htTopNav() {
    var directive = {
      bindToController: true,
      controller: TopNavController,
      controllerAs: 'vm',
      restrict: 'EA',
      scope: {
        'navline': '='
      },
      templateUrl: 'app/layout/ht-top-nav.html'
    };

    TopNavController.$inject = ['$scope', 'myAuth', '$rootScope', 'AUTH_EVENTS'];

    /* @ngInject */
    function TopNavController($scope, myAuth, $rootScope, AUTH_EVENTS) {
      var vm = this;
      vm.isLogged = false;
      vm.logout = logout;

      $scope.isCollapsed = true;

      refresh();

      $rootScope.$on(AUTH_EVENTS.loginSuccess, function(){
        refresh();   
      });

      $rootScope.$on(AUTH_EVENTS.logoutSuccess, function(){
        refresh();   
      });

      function refresh(){
       vm.isLogged = myAuth.isAuthentificated();
     }

      function logout(){
        myAuth.logout();
      }
    }

    return directive;
  }
})();
