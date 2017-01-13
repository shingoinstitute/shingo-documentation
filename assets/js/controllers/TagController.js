(function(){
  angular.module('ShingoDocumentationApp')
  .controller('TagController', ['$scope', '$routeParams', 'tags', 'auth','$location', '$window','$q','_','toast','dialog',TagController]);

  function EditController($scope, $mdDialog, method){
    $scope.tag = angular.copy(tag);
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function() {
      $mdDialog.hide($scope.tag);
    };
  }

  function TagController($scope, $routeParams, tags, auth, $location, $window, $q, _, toast, dialog){
    var vm = this;
    vm.tag = {};
    vm.isOpen = false;
    vm.me = {};
    vm.isAuthed = false;

    (vm.loadTag = function(){
      tags.get($routeParams.uuid)
      .then(function(t){
        vm.tag = t;
        return auth.me();
      })
      .then(function(me){
        vm.me = me;
        if(me && me.id){
          vm.isAuthed = true;
        }
      })
      .catch(function(err){
        if(err)
          toast.create("Error getting tag!", {bottom: true, center: true});
      });
    })();

    vm.go = function(path){
      $location.path(path);
    }

    vm.login = function(){
      $window.location.href = 'http://docs.shingo.org:8085/auth/login?path=' + $location.path();
    }

    vm.logout = function(){
      $window.location.href = 'http://docs.shingo.org:8085/auth/logout';
    }

    vm.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    vm.edit = function(){
      dialog.create(EditController, 'templates/tag/edit.tmpl.html', null, {tag: vm.tag})
      .then(function(tag){
        return vm._edit(tag);
      })
      .then(function(t){
        vm.tag = t;
        toast.create("Tag updated!", {bottom: true, center: true});
      })
      .catch(function(err){
        if(err)
          toast.create("Error updating tag!", {bottom: true, center: true});
      });
    }

    vm._edit = function(tag){
      // TODO: Validate method
      return tags.put(tag);
    }
  }
})();
