/*(function() {
    var auth = angular.module('app');
    auth.factory('authInterceptor', authInterceptor);

    authInterceptor.$inject = ['API', 'cacheManager', '$q'];

    function authInterceptor(API, cacheManager, $q) { 
        return {
            //attaches authorisation header
            request: function(config) {
                var deferred = $q.defer();
                //is autorised 
                //if header exists 
                //конфигурация $http установка header авторизации
                cacheManager.get('JWT').then(function(token){
                    if(token){
                        config.headers.Authoristaion = 'JWT ' + token;
                    }                   
                    deferred.resolve(config);
                });
                return deferred.promise;
            },
            // if token is sent back, saves it
            response: function(res) {
                if(res.config.url.indexOf(API) === 0 && res.data.token){
                    auth.saveToken(res.data.jwt);
                }
                return res;
            }
        }
    }
})()
*/