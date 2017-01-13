(function(){
  angular.module('ShingoDocumentationApp')
  .controller('DocumentController', ['$scope', '$routeParams', 'documents', 'tags', 'methods', 'auth','$location', '$window','$q','_','toast','dialog',DocumentController]);

  function AddController($scope, $mdDialog){
    $scope.method = {parameters:[]};
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

  function EditController($scope, $mdDialog, document){
    $scope.document = angular.copy(document);
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function() {
      $mdDialog.hide($scope.document);
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

  function DocumentController($scope, $routeParams, documents, tags, methods, auth, $location, $window, $q, _, toast, dialog){
    var vm = this;
    vm.document = {};
    vm.isOpen = false;
    vm.selectAll = false;
    vm.selected = {};
    vm.me = {};
    vm.isAuthed = false;

    $scope.$watch('vm.selectAll', function(newValue, oldValue){
      _.forEach(vm.selected, function(v,k){
        vm.selected[k] = newValue;
      });
    });

    (vm.loadDocument = function(){
      documents.get($routeParams.uuid)
      .then(function(d){
        vm.document = d;
        return auth.me();
      })
      .then(function(me){
        vm.me = me;
        if(me && me.id){
          vm.isAuthed = true;
          _.forEach(vm.document.methods, function(v, k){
            vm.selected[v.uuid] = false;
          })
        }
      })
      .catch(function(err){
        if(err)
          toast.create("Error getting document!", {bottom: true, center: true});
      });
    })();

    vm.go = function(path){
      $location.path(path);
    }

    vm.login = function(){
      $window.location.href = 'https://shingo.org:8085/auth/login?path=' + $location.path();
    }

    vm.logout = function(){
      $window.location.href = 'https://shingo.org:8085/auth/logout';
    }

    vm.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    vm.add = function(){
      dialog.create(AddController, 'templates/method/add-edit.tmpl.html')
      .then(function(method){
        return vm._add(method);
      })
      .then(function(m){
        vm.document.methods.push(m);
        vm.selected[m.uuid] = vm.selectAll;
        toast.create("Method, " + m.name + ", added!", {bottom: true, center: true});
      }).catch(function(err){
        if(err)
          toast.create("Error adding method!", {bottom: true, center: true});
      });
    }

    vm._add = function(method){
      method.document = vm.document.uuid;
      return methods.post(method);
    }

    vm.edit = function(){
      dialog.create(EditController, 'templates/document/add-edit.tmpl.html', null, {document: vm.document})
      .then(function(document){
        return vm._edit(document);
      })
      .then(function(d){
        vm.document = d;
        toast.create("Document updated!", {bottom: true, center: true});
      })
      .catch(function(err){
        if(err)
          toast.create("Error updating document!", {bottom: true, center: true});
      });
    }

    vm._edit = function(document){
      // TODO: Validate document
      return documents.put(document);
    }

    vm.tag = function(){
      dialog.create(TagController, 'templates/tag/add.tmpl.html', null, {current: vm.document.tags})
      .then(function(tags){
        var diffTags = _.differenceBy(vm.document.tags, tags, 'uuid');
        var newTags = _.pullAllBy(tags, vm.document.tags, 'uuid');
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
        vm.loadDocument();
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
        return tags.addResource(tag, vm.document, 'documents');
      } else {
        return tags.post(tag)
        .then(function(tag){
          return tags.addResource(tag, vm.document, 'documents');
        })
        .catch(function(err){
          throw err;
        });
      }
    }

    vm._untag = function(tag){
      return tags.removeResource(tag, vm.document, 'documents');
    }

    vm.delete = function(){
      var promises = new Array();
      _.forEach(vm.selected, function(v,k){
        if(v)
          promises.push(vm._delete(k));
      });

      $q.all(promises)
      .then(function(values){
        toast.create("Methods deleted!");
        vm.loadDocument();
      })
      .catch(function(err){
        if(err)
          toast.create("Error deleting methods");
      });
    }

    vm._delete = function(uuid){
      vm.selected = _.omit(vm.selected, uuid);
      return methods.delete(uuid);
    }
  }
})();
