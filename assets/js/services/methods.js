(function(){
  angular.module('ShingoDocumentationApp')
  .factory('methods', ['$http', '_', methods]);

  var BASE_URL = '/method';

  function methods($http, _){
    return {
      get: function(uuid){
        var url = BASE_URL + (uuid ? '/' + uuid : '');

        return $http({
          method: 'get',
          dataType: 'json',
          url: url
        }).then(function(data){
          return data.data;
        }).catch(function(err){
          throw err;
        });
      },
      post: function(method){
        return $http({
          method: 'post',
          dataType: 'json',
          url: BASE_URL,
          data: method
        }).then(function(data){
          return data.data;
        }).catch(function(err){
          throw err;
        });
      },
      put: function(method){
        return $http({
          method: 'put',
          dataType: 'json',
          url: BASE_URL + '/' + method.uuid,
          data: _.pick(method, ['name', 'content', 'shortDescription', 'signature', 'parameters', 'returnValue', 'deprecated'])
        }).then(function(data){
          return data.data;
        }).catch(function(err){
          throw err;
        });
      },
      delete: function(uuid){
        return $http({
          method: 'delete',
          dataType: 'json',
          url: BASE_URL + '/' + uuid
        }).then(function(data){
          return data.data;
        }).catch(function(err){
          throw err;
        });
      }
    }
  }
})();
