(function(){
  angular.module('ShingoDocumentationApp')
  .controller('MethodController', ['$scope', '$routeParams', 'documents', 'tags', 'methods', 'auth','$location', '$window','$q','_','toast','dialog',MethodController]);

  function EditController($scope, $mdDialog, method){
    $scope.method = angular.copy(method);
    if(!$scope.method.parameters) $scope.method.parameters = [];
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function() {
      $mdDialog.hide($scope.method);
    };
  }

  function TagController($scope, $mdDialog, tags, current){
    $scope.tags = loadTags();
    $scope.selected = angular.copy(current);
    $scope.search = tagSearch;
    $scope.transformChip = transformChip;
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function() {
      $mdDialog.hide($scope.selected);
    };

    function tagSearch(query){
      return query ? $scope.tags.filter(createFilterFor(query)) : [];
    }

    function createFilterFor(query){
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(tag){
        tag._lowername = tag.label.toLowerCase();
        return (tag._lowername.indexOf(lowercaseQuery) === 0);
      }
    }

    function transformChip(chip){
      if(angular.isObject(chip)) return chip;
      else {
        var t = _.find($scope.tags, function(o){return o.label === chip});
        if(t) return t;
      }

      return {label: chip};
    }

    function loadTags(){
      tags.get()
      .then(function(T){
        return $scope.tags = T;
      })
      .catch(function(err){
        $mdPanel.cancel();
      });
    }
  }

  function MethodController($scope, $routeParams, documents, tags, methods, auth, $location, $window, $q, _, toast, dialog){
    var vm = this;
    vm.method = {};
    vm.isOpen = false;
    vm.me = {};
    vm.isAuthed = false;

    (vm.loadMethod = function(){
      methods.get($routeParams.uuid)
      .then(function(m){
        vm.method = m;
        vm.method.parameters = vm.method.parameters.split(',');
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
          toast.create("Error getting method!", {bottom: true, center: true});
      });
    })();

    vm.go = function(path){
      $location.path(path);
    }

    vm.login = function(){
      $window.location.href = 'http://docs.shingo.org/auth/login?path=' + $location.path();
    }

    vm.logout = function(){
      $window.location.href = 'http://docs.shingo.org/auth/logout';
    }

    vm.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    vm.edit = function(){
      dialog.create(EditController, 'templates/method/add-edit.tmpl.html', null, {method: vm.method})
      .then(function(method){
        return vm._edit(method);
      })
      .then(function(m){
        vm.method = m;
        vm.method.parameters = vm.method.parameters.split(',');
        toast.create("Method updated!", {bottom: true, center: true});
      })
      .catch(function(err){
        if(err)
          toast.create("Error updating method!", {bottom: true, center: true});
      });
    }

    vm._edit = function(method){
      // TODO: Validate method
      return methods.put(method);
    }

    vm.tag = function(){
      dialog.create(TagController, 'templates/tag/add.tmpl.html', null, {current: vm.method.tags})
      .then(function(tags){
        var diffTags = _.differenceBy(vm.method.tags, tags, 'uuid');
        var newTags = _.pullAllBy(tags, vm.method.tags, 'uuid');
        var promises = newTags.map(function(tag){
          return vm._tag(tag);
        });

        promises = _.union(promises, diffTags.map(function(tag){
          return vm._untag(tag);
        }));

        return $q.all(promises)
      })
      .then(function(values){
        toast.create("Tags updated!");
        vm.loadMethod();
      })
      .then(function(p){
        vm.project = p;
      })
      .catch(function(err){
        if(err)
          toast.create("There was an error adding your tags!");
      });
    }

    vm._tag = function(tag){
      if(tag.uuid){
        return tags.addResource(tag, vm.method, 'methods');
      } else {
        return tags.post(tag)
        .then(function(tag){
          return tags.addResource(tag, vm.method, 'methods');
        })
        .catch(function(err){
          throw err;
        });
      }
    }

    vm._untag = function(tag){
      return tags.removeResource(tag, vm.method, 'methods');
    }
  }
})();
