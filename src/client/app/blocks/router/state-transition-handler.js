(function(){
    'use strict';

    var router = angular.module('blocks.router')
    .run(stateWatcher);

    stateWatcher.$inject = ['$rootScope', 'authService', '$q', '$state', 'USER_ROLES', 'AUTH_EVENTS', '$localStorage'];
    function stateWatcher($rootScope, authService, $q, $state, USER_ROLES, AUTH_EVENTS, $localStorage){
        //default states
        var defaultStates = {
            loginSuccess: 'dashboard',
            logoutSuccess: 'login'
        };

        $rootScope.$on('$stateChangeStart', isStateAuthorized);

        //Go to the default states for login and logout events
        $rootScope.$on(AUTH_EVENTS.loginSuccess, go(defaultStates.loginSuccess));
        $rootScope.$on(AUTH_EVENTS.logoutSuccess, go(defaultStates.logoutSuccess));

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error){
            event.preventDefault();
            console.log(error);
        });

        function isStateAuthorized(event, toState, toParams, fromState, fromParams, options){
            //if desired state has admission setting
           if(toState.settings && toState.settings.roles){
            //Check if user`s role is appropriate
            if(!authService.isAuthorized(toState.settings.roles)){
                preventStateChange('dashboard');
            }

        }

        function preventStateChange(defaultSate){

             event.preventDefault();

             try{
                //Go to previous state
                    $state.go(fromState.name);    
            }catch(err){
                //If user doesnt have any previous state go to defualt
                    $state.go(defaultSate);
                }   
           }
        }       

        function go(state){
            return function(){
                $state.go(state);
            };
        }
    }
})();