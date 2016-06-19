'use strict';
(function () {

  angular
    .module('core.base')
    .factory('BaseService', BaseService);

  BaseService.$inject = ['$resource', '$http', '$q', '$timeout', '$ds', 'cacheManager', '$rootScope'];

  /* @ngInject */
  function BaseService($resource, $http, $q, $timeout, $ds, cacheManager, $rootScope) {

    var baseService = function () {
    };

    //public methods
    baseService.prototype = {};
    baseService.prototype.Init = Init;
    baseService.prototype.Get = Get;
    baseService.prototype.GetList = GetList;
    baseService.prototype.Update = Update;
    baseService.prototype.Create = Create;
    baseService.prototype.Delete = Delete;
    baseService.prototype.AddEventListeners = AddEventListeners;

    return baseService;

    /////////////////////////
    function Init(apiUrl, modelName, server, isArray, cacheParams, urlPostfix, urlPostfixParams) {
      var self = this;
      self.__apiUrl = apiUrl;
      self.__server = server || null;
      self.__isArray = (isArray || false);
      self.__modelName = modelName;
      //cache
      self.__cacheParams = cacheParams || {caching: false, duration: null}; //duration in minutes
      /*Dealing with postfix params*/
      self.__postfixParams = urlPostfixParams || null;
      var postfixObject = null;
      if (self.__postfixParams) {
        postfixObject = {};
        postfixObject['id'] = '@id';
        for (var i = 0; i < urlPostfixParams.length; i++) {
          postfixObject[urlPostfixParams[i]] = '@' + urlPostfixParams[i];
        }
      }
      self.__repository = $resource($ds.WrapUrl(self.__apiUrl, server) + '/:id' + (urlPostfix ? urlPostfix : ''), postfixObject ? postfixObject : {id: '@id'}, {
        'update': {method: 'PUT'},
        'getArray': {
          method: 'GET',
          isArray: true,
          transformResponse: function (response) {
            var newData = JSON.parse(response);
            newData.map(function (data) {
              data._length = data.length;
              return data;
            });
            return newData;
          }
        }
      });
    }


    function Update(data) {
      var self = this;
      var deferred = $q.defer();
      self.__repository.update({}, data, function (data) {
          var hashKey = _getHashKey(data.id, 'single');
          var duration = self.__cacheParams.durationSingle ? self.__cacheParams.durationSingle : self.__cacheParams.duration;
          var now = new Date();
          var expires = new Date(now.getTime() + duration * 60000);
          cacheManager.Set(self.__modelName + hashKey, {expires: expires, data: data});
          return deferred.resolve(data);         
        },
        function (error) {
          return deferred.reject(error);
        });
      return deferred.promise;
    }

    function Create(model) {
      var self = this;
      var deferred = $q.defer();
      self.__repository.save({}, model, function () {
          deferred.resolve(model);
        },
        function (error) {
          deferred.reject(error);
        });
      return deferred.promise;
    }

    function Get(id, surpassesCache) {

      var hashKey = _getHashKey(id, 'single');
      var self = this;
      console.log('Get', self.__modelName, 'id', id);
      var deferred = $q.defer();
      if (!(surpassesCache || false) && self.__cacheParams.caching) {
        //try to get from cache
        console.log('Single. Cache enabled. Trying to get: ' + self.__modelName + hashKey);
        cacheManager.Get(self.__modelName + hashKey)
          .then(function (value) {
            var now = new Date();
            var expires = new Date(value.expires);
            console.log('Cache value by provided key found.');
            if (expires > now) {
              console.log('Single data was loaded from cache. Key ' + self.__modelName + hashKey);
              deferred.resolve(value.data);
            }
            else {
              _getSingle.call(self, deferred, id);
            }
          })
          .catch(function (error) {
            //no data found in storage
            _getSingle.call(self, deferred, id);
          });
      }
      else {
        _getSingle.call(self, deferred, id);
      }
      return deferred.promise;
    }

    function _getSingle(deferred, id) {
      var self = this;
      self.__repository.get({id: id}, function (response) {
        //save data to cache if enabled
        if (self.__cacheParams.caching) {
          //save to cache
          var duration = self.__cacheParams.durationSingle ? self.__cacheParams.durationSingle : self.__cacheParams.duration;
          var now = new Date();
          var expires = new Date(now.getTime() + duration * 60000);
          var hashKey = _getHashKey(id, 'single');
          cacheManager.Set(self.__modelName + hashKey, {expires: expires, data: response});
        }
        deferred.resolve(response);
      }, function (errors) {
        deferred.reject(errors);
      });
    }

    function GetList(id) {
      var hashKey = _getHashKey(id, 'list');
      var self = this;
      //console.log('GetList', self.__modelName);
      var deferred = $q.defer();
      if (self.__cacheParams.caching) {
        //try to get from cache
        //console.log('Cache enabled. Trying to get: ' + self.__modelName + hashKey);
        cacheManager.Get(self.__modelName + hashKey)
          .then(function (value) {
            var now = new Date();
            var expires = new Date(value.expires);
            //console.log('Cache value by provided key found.');
            if (expires > now) {
              //console.log('List data was loaded from cache. Key ' + self.__modelName + hashKey);
              deferred.resolve(value.data);
            }
            else {
              _getList.call(self, deferred, id);
            }
          })
          .catch(function (error) {
            //no data found in storage
            _getList.call(self, deferred, id);
          });
      }
      else {
        _getList.call(self, deferred, id);
      }
      return deferred.promise;
    }

    function _getList(deferred, id) {
      var self = this;
      //if id is postfixParams, then aplly postfix params
      //if id is just id, then apply {id:id}
      //if none use default
      self.__repository.query(id ? ( self.__postfixParams ? id : {id: id}) : {}, function (response) {
        if (self.__cacheParams.caching) {
          //save to cache
          var duration = self.__cacheParams.durationList ? self.__cacheParams.durationList : self.__cacheParams.duration;
          var now = new Date();
          var expires = new Date(now.getTime() + duration * 60000);
          var hashKey = _getHashKey(id, 'list');
          cacheManager.Set(self.__modelName + hashKey, {expires: expires, data: response});
        }
        deferred.resolve(response);
      }, function (response) {
        deferred.reject(response);
      });
    }

    function Delete(id) {
      var self = this;
      var deferred = $q.defer();
      self.__repository.remove({id: id}, {}, function (response) {
        return deferred.resolve(response);
      }, function (error) {
        return deferred.reject(error);
      });
      cacheManager.Clear(id);
      return deferred.promise;
    }

    function AddEventListeners(eventName, action) {
      //subscribe to broadcast event
      $rootScope.$on(eventName, action);
    }

    function _getHashKey(obj, prefix) {
      return obj ? JSON.stringify({data: obj}).replace(/[\W_]+/g, '') : '' + (prefix || '');
    }

  }
})();

