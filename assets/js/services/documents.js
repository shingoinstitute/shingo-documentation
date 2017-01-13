(function(){
  angular.module('ShingoDocumentationApp')
  .factory('documents', ['$http', '_', documents]);

  var BASE_URL = '/document';

  function documents($http, _){
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
      post: function(document){
        return $http({
          method: 'post',
          dataType: 'json',
          url: BASE_URL,
          data: document
        }).then(function(data){
          return data.data;
        }).catch(function(err){
          throw err;
        });
      },
      put: function(document){
        return $http({
          method: 'put',
          dataType: 'json',
          url: BASE_URL + '/' + document.uuid,
          data: _.pick(document, ['title', 'content', 'shortDescription'])
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
