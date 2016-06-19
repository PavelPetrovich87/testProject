(function() {
  'use strict';

  angular
    .module('app.layout')
    .controller('SidebarController', SidebarController);

  SidebarController.$inject = ['$state', 'routerHelper', 'myAuth', '$rootScope', 'AUTH_EVENTS'];
  /* @ngInject */
  function SidebarController($state, routerHelper, myAuth, $rootScope, AUTH_EVENTS) {

    var vm = this;
    var states = routerHelper.getStates();
    var userRole = 'unauthed';

    vm.isCurrent = isCurrent;

    $rootScope.$on(AUTH_EVENTS.loginSuccess, function(){
      refresh();   
    });

    $rootScope.$on(AUTH_EVENTS.logoutSuccess, function(){
      refresh();
    });

    refresh();


    function getNavRoutes() {

      vm.navRoutes = states.filter(filterByAuthorisation)
                           .filter(filterNavRoutes)
                           .sort(sortByPosition);                         
    }

    function isCurrent(route) {
      if (!route.title || !$state.current || !$state.current.title) {
        return '';
      }
      var menuName = route.title;
      return $state.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
    }

    function sortByPosition(r1, r2){
      return r1.settings.nav - r2.settings.nav;
    }

    function filterNavRoutes(r){
      return r.settings && r.settings.nav;
    }

    function filterByAuthorisation(r){
      if(r.settings && r.settings.roles){
        var stateRoles = r.settings.roles;
        return myAuth.isAuthorized(stateRoles);
      }     
      return true;
    }

    function refresh(){
      userRole = myAuth.getRole();
      getNavRoutes();
    }

  }
})();
