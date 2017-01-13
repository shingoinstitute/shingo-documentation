(function(){
  angular.module('ShingoDocumentationApp')
  .controller('ProjectController', ['$scope', '$routeParams', 'projects', 'documents', 'tags', 'auth','$location', '$window','$q','_','toast','dialog',ProjectController]);

  function AddController($scope, $mdDialog){
    $scope.document = {};
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

  function EditController($scope, $mdDialog, project){
    $scope.project = angular.copy(project);
    $scope.title = "Edit"
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function() {
      $mdDialog.hide($scope.project);
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

  function ProjectController($scope, $routeParams, projects, documents, tags, auth, $location, $window, $q, _, toast, dialog){
    var vm = this;
    vm.project = {};
    vm.isOpen = false;
    vm.selectAll = false;
    vm.selected = {};
    vm.me = {};
    vm.isAuthed = false;
    vm.activeLink = {}

    $scope.$watch('vm.selectAll', function(newValue, oldValue){
      _.forEach(vm.selected, function(v,k){
        vm.selected[k] = newValue;
      });
    });

    (vm.loadProject = function(){
      projects.get($routeParams.uuid)
      .then(function(p){
        vm.project = p;
        return auth.me();
      })
      .then(function(me){
        vm.me = me;
        if(me && me.id){
          vm.isAuthed = true;
          _.forEach(vm.project.documents, function(v, k){
            vm.selected[v.uuid] = false;
          })
        }
      })
      .catch(function(err){
        if(err)
          toast.create("Error getting project!", {bottom: true, center: true});
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

    vm.add = function(){
      dialog.create(AddController, 'templates/document/add-edit.tmpl.html')
      .then(function(document){
        return vm._add(document);
      })
      .then(function(d){
        vm.project.documents.push(d);
        vm.selected[d.uuid] = vm.selectAll;
        toast.create("Document, " + d.title + ", added!", {bottom: true, center: true});
      }).catch(function(err){
        if(err)
          toast.create("Error adding document!", {bottom: true, center: true});
      });
    }

    vm._add = function(document){
      document.project = vm.project.uuid;
      return documents.post(document);
    }

    vm.edit = function(){
      dialog.create(EditController, 'templates/project/add-edit.tmpl.html', null, {project: vm.project})
      .then(function(project){
        return vm._edit(project);
      })
      .then(function(p){
        vm.project = p;
        toast.create("Project updated!", {bottom: true, center: true});
      })
      .catch(function(err){
        if(err)
          toast.create("Error updating project!", {bottom: true, center: true});
      });
    }

    vm._edit = function(project){
      // TODO: Validate project
      return projects.put(project);
    }

    vm.tag = function(){
      dialog.create(TagController, 'templates/tag/add.tmpl.html', null, {current: vm.project.tags})
      .then(function(tags){
        var diffTags = _.differenceBy(vm.project.tags, tags, 'uuid');
        var newTags = _.pullAllBy(tags, vm.project.tags, 'uuid');
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
        return projects.get($routeParams.uuid);
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
        return tags.addResource(tag, vm.project, 'projects');
      } else {
        return tags.post(tag)
        .then(function(tag){
          return tags.addResource(tag, vm.project, 'projects');
        })
        .catch(function(err){
          throw err;
        });
      }
    }

    vm._untag = function(tag){
      return tags.removeResource(tag, vm.project, 'projects');
    }

    vm.delete = function(){
      var promises = new Array();
      _.forEach(vm.selected, function(v,k){
        if(v)
          promises.push(vm._delete(k));
      });

      $q.all(promises)
      .then(function(values){
        toast.create("Documents deleted!");
        vm.loadProject();
      })
      .catch(function(err){
        if(err)
          toast.create("Error deleting documents");
      });
    }

    vm._delete = function(uuid){
      vm.selected = _.omit(vm.selected, uuid);
      return documents.delete(uuid);
    }
  }
})();
