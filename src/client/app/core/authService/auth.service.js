(function (){
    var auth = angular.module('core.auth');

    auth.provider('authService', authServiceProvider);

    function authServiceProvider(){

        //Authorization endpoint
        var endpointUri = '';

        this.configEndPoint = configEndpoint;
        //Authorization endpoint setter
        function configEndpoint(api, loginUri){
            endpointUri = api + loginUri;
        }

        this.$get = instantiateAuth;

        instantiateAuth.$inject = ['$q', '$rootScope', 'logger',
                                  '$localStorage' , 'cacheManager', '$http',
                                  'AUTH_EVENTS'];

        function instantiateAuth($q, $rootScope, logger, $localStorage, cacheManager, $http, AUTH_EVENTS){

            return {
                authenticate: authenticate,
                getUserData: getUserData,
                getToken: getToken,
                isAuthentificated: isAuthentificated,
                isAuthorized: isAuthorized,
                getRole: getRole,
                logout: logout 
            };

            function authenticate(authData){
                var jsonLoginData = JSON.stringify(authData);
                var deferred = $q.defer(); 
                //Authenticate via post method            
                $http.post(endpointUri, jsonLoginData).then(onSuccess, onError);

                //cache user data and JWT and emit authentification event
                function onSuccess(res){
                    var data = extractData(res);
            
                    setUserData(data);
                    logger.success('Authenticated');
                    
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

                    deferred.resolve(data);
                }

                function onError(res){
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                    logger.error('Authentification Error');
                    deferred.reject();
                }

                return deferred.promise; 
            }

            function setUserData(data){
                saveToken(data.jwt);
                var userData = JSON.stringify(data);               
                $localStorage.user = userData;               
            }    

            function getUserData(){
                var userData = null;

                if($localStorage['user']){
                     userData = JSON.parse($localStorage['user']);
                }

                return userData;
            }
            //Returns user`s role, if it doesn`t exist user is unauthed
            function getRole(){
                if(getUserData()){
                    return getUserData().scope.name;
                }else{
                    return 'unauthed';
                }
            }

            function getToken(){
                return $localStorage.token;
            }

            function extractData (dataToExtract){
                return dataToExtract.data;
            }

            function saveToken(token){
                $localStorage.token = token;
            }

            //if User has some role - he`s already authentificated
            function isAuthentificated(){
               var role = getRole();
               return role === 'unauthed' ? false : true;
            }

            //If user has an appropriate role
            function isAuthorized (authorizedRoles) {
                if (!angular.isArray(authorizedRoles)) {
                  authorizedRoles = [authorizedRoles];
                }
                return (authorizedRoles.indexOf(getRole()) !== -1) 
            };
            //Clears cache and emit an appropriate event
            function logout(){
                $localStorage.$reset();
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            }
        } 
    }
})();