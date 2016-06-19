(function() {
    'use strict';
    var auth = angular.module('core.auth', ['app.core', 'ngResource', 'core.cacheManager']);

    auth.constant('API', 'http://52.27.173.34:1336');
    auth.constant('AUTH_ENDPOINT', '/auth');
    auth.constant('AUTH_EVENTS', {
      loginSuccess: 'auth-login-success',
      loginFailed: 'auth-login-failed',
      logoutSuccess: 'auth-logout-success',
      notAuthenticated: 'auth-not-authenticated',
      notAuthorized: 'auth-not-authorized'
    });
    auth.constant('USER_ROLES', {
      all: '*',
      resseller: 'Resseller',
      unauthed: 'unauthed',
      guest: 'guest'
    });
    auth.config(config);
    auth.run(runConf);

    config.$inject = ['API', 'AUTH_ENDPOINT', 'myAuthProvider', '$httpProvider'];
    
    function config(API, AUTH_ENDPOINT, myAuthProvider, $httpProvider){
      //Configuring authentification endpoint
        myAuthProvider.configEndPoint(API, AUTH_ENDPOINT);
        $httpProvider.defaults.withCredentials = true;
    }

    runConf.$inject = ['$http', 'myAuth', '$rootScope', 'AUTH_EVENTS'];

    function runConf($http, myAuth, $rootScope, AUTH_EVENTS){
      //Attaching Authorization header
      //If user is already authentificated
      if(myAuth.isAuthentificated()){
          $http.defaults.headers.get = getAuthObj();
      }
      //If he is successfully logged in
      $rootScope.$on(AUTH_EVENTS.loginSuccess, function(){         
          $http.defaults.headers.get = getAuthObj();
      });
      //Detach Authorization header if he is logged out
      $rootScope.$on(AUTH_EVENTS.logoutSuccess, function(){
          $http.defaults.headers.get = {};
      });

      function getAuthObj(){
        var token = myAuth.getToken();
        return { 'Authorization': 'JWT ' + token }; 
      }     
  }
    
})()