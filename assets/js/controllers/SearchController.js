(function(){
  angular.module('ShingoDocumentationApp')
  .controller('SearchController', ['$scope', '$location', '$q', '$http', '$timeout', '_', 'toast', SearchController]);

  function SearchController($scope, $location, $q, $http, $timeout, _, toast){
    var vm = this;
    var pendingSearch, cancelSearch = angular.noop;
    var cachedQuery, lastSearch;
    vm.filterSelected = false;
    vm.results = {};
    vm.activeLink = {search: 'active-link'};
    vm.isSearching = false;

    vm.go = function(path){
      $location.path(path);
    }

    vm.query = function(criteria){
      cachedQuery = criteria;
      if(!pendingSearch || !debounceSearch()){
        vm.isSearching = true;
        return pendingSearch = $http.get('/query?query=' + criteria)
          .then(function(data){
            refreshDebounce();
            vm.isSearching = false;
            return data.data;
          })
          .catch(function(err){
            cancelSearch = err;
            return;
          });
      }
    }

    vm.search = '';
    $scope.$watch('vm.search', function(newValue){
      if(newValue === ''){
         vm.isSearching = false;
         $timeout(function(){vm.results = {};},10);
      } else {
        vm.query(newValue)
        .then(function(r){
          vm.results = r;
        })
        .catch(function(err){
          console.log(err);
          vm.results = {};
        });
      }
    })

    function refreshDebounce(){
      lastSearch = 0;
      pendingSearch = null;
      cancelSearch = angular.noop;
    }

    function debounceSearch() {
      var now = new Date().getMilliseconds();
      lastSearch = lastSearch || now;
      return ((now - lastSearch) < 300);
    }
  }
})();
