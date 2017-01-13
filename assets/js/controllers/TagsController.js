(function(){
  angular.module('ShingoDocumentationApp')
  .controller('TagsController', ['$scope','tags','auth','$location', '$window','$q','_','toast','dialog',TagsController]);

  function TagsController($scope, tags, auth, $location, $window, $q, _, toast, dialog){
    var vm = this;
    vm.tags = new Array();
    vm.isOpen = false;
    vm.me = {};
    vm.selectAll = false;
    vm.isAuthed = false;
    vm.selected = {};
    vm.activeLink = { tags: 'active-link'}

    $scope.$watch('vm.selectAll', function(newValue, oldValue){
      _.forEach(vm.selected, function(v,k){
        vm.selected[k] = newValue;
      });
    });

    vm.loadTags = function(){
      tags.get()
      .then(function(t){
        vm.tags = t;
        _.forEach(vm.tags, function(v){
          vm.selected[v.uuid] = false;
        });
        return auth.me();
      })
      .then(function(me){
        vm.me = me;
        if(me && me.id) vm.isAuthed = true;
      })
      .catch(function(err){
        if(err)
          toast.create("Error getting tags!", {bottom: true, center: true});
      });
    };
    vm.loadTags();

    vm.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    vm.go = function(uuid){
      $location.path('/tag/' + uuid);
    }

    vm.login = function(){
      $window.location.href = 'http://docs.shingo.org/auth/login';
    }

    vm.logout = function(){
      $window.location.href = 'http://docs.shingo.org/auth/logout';
    }

    vm.delete = function(){
      var promises = [];
      _.forEach(vm.selected, function(v,k){
        if(v)
          promises.push(vm._delete(k));
      });
      $q.all(promises)
      .then(function(values){
        toast.create("Tags deleted!")
        vm.loadTags();
      })
      .catch(function(err){
        toast.create("There was an error deleting the tags!");
      });
    }

    vm._delete = function(uuid){
      _.omit(vm.selected, uuid);
      return tags.delete(uuid);
    }
  }
})();
