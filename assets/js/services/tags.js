(function(){
  angular.module('ShingoDocumentationApp')
  .factory('tags', ['$http', '_', tags]);

  var BASE_URL = '/tag';

  function tags($http, _){
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
      post: function(tag){
        return $http({
          method: 'post',
          dataType: 'json',
          url: BASE_URL,
          data: tag
        }).then(function(data){
          return data.data;
        }).catch(function(err){
          throw err;
        });
      },
      put: function(tag){
        return $http({
          method: 'put',
          dataType: 'json',
          url: BASE_URL + '/' + tag.uuid,
          data: _.pick(tag, ['label'])
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
      },
      addResource: function(tag, resource, type){
        var data = {};
        if(!resource.uuid)
          data = resource;
        return $http({
          method: 'post',
          dataType: 'json',
          url: BASE_URL + '/' + tag.uuid + '/' + type + '/' + (resource.uuid ? resource.uuid : ''),
          data: data
        }).then(function(data){
          console.log('addRes', data);
          return data.data;
        }).catch(function(err){
          throw err;
        })
      },
      removeResource: function(tag, resource, type){
        return $http({
          method: 'delete',
          dataType: 'json',
          url: BASE_URL + '/' + tag.uuid + '/' + type + '/' + resource.uuid
        }).then(function(data){
          return data.data;
        }).catch(function(err){
          throw err;
        });
      }
    }
  }
})();
