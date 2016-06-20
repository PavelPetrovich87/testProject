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

    TopNavController.$inject = ['$scope', 'authService', '$rootScope', 'AUTH_EVENTS'];

    /* @ngInject */
    function TopNavController($scope, authService, $rootScope, AUTH_EVENTS) {
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
       vm.isLogged = authService.isAuthentificated();
     }

      function logout(){
        authService.logout();
      }
    }

    return directive;
  }
})();
