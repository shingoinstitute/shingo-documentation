(function(){
  angular.module('ShingoDocumentationApp')
  .factory('auth', ['$http', auth]);

  function auth($http){
    return {
      me: function(){
        return $http({
          method: 'get',
          dataType: 'json',
          url: '/auth/me'
        }).then(function(data,status){
          return data.data;
        }).catch(function(err){
          throw err;
        });
      }
    }
  }
})();
