(function() {
    'use strict';

    var cache = angular.module('core.cacheManager');

    cache.factory('cacheManager', cacheManager);


    cacheManager.$inject = ['$q'];

    function cacheManager($q){
        var localforage = window.localforage;

        return {
            Get: get,
            Set: set,
            Has: has,
            Clear: clear,
        };

        function get(key){
            console.log('getting from cache by the key:' + key);
            var deferred = $q.defer();           
            localforage.getItem(key)
                .then(handleItem)
                .catch(
                    function (error, value) {
                        deferred.reject(null);
                    }
                );

            function handleItem(item){
                if (item === null) {
                  deferred.reject(null);
                }
                deferred.resolve(item);
            }

            return deferred.promise;                     
        }

        function set(key, objToSet){
            var deferred = $q.defer();
            console.log('setting to cache by the key:' + key);
            localforage.setItem(key, objToSet)
                    .then(function (value) {
                      deferred.resolve(value);
                    })
                    .catch(function (error, value) {
                      deferred.reject(null);
                    });
            return deferred.promise;

        }

        function has(key) {
            var deferred = $q.defer();

            get(key)
            .then(function(value) {
                deferred.resolve(true);              
            })
            .catch(function(err) {
                deferred.reject(false);
            });

            return deferred.promise;
        }

        function clear(key){
            if(key){
                return localforage.removeItem(key);
            }else{
                return localforage.clear();
            }
        }

    }

})();