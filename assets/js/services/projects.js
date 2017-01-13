(function(){
  angular.module('ShingoDocumentationApp')
  .factory('projects', ['$http', '_', projects]);

  var BASE_URL = '/project';

  function projects($http, _){
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
      post: function(project){
        return $http({
          method: 'post',
          dataType: 'json',
          url: BASE_URL,
          data: project
        }).then(function(data){
          return data.data;
        }).catch(function(err){
          throw err;
        });
      },
      put: function(project){
        return $http({
          method: 'put',
          dataType: 'json',
          url: BASE_URL + '/' + project.uuid,
          data: _.pick(project, ['name', 'description', 'repository'])
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
