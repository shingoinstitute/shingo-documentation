(function(){
  angular.module('ShingoDocumentationApp')
  .controller('HomeController', ['$scope','projects','auth','$location', '$window','$q','_','toast','dialog',HomeController]);

  function AddController($scope, $mdDialog){
    $scope.project = {};
    $scope.title = "Add";
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

  function HomeController($scope, projects, auth, $location, $window, $q, _, toast, dialog){
    var vm = this;
    vm.projects = new Array();
    vm.isOpen = false;
    vm.me = {};
    vm.selectAll = false;
    vm.isAuthed = false;
    vm.selected = {};
    vm.activeLink = { projects: 'active-link'}

    $scope.$watch('vm.selectAll', function(newValue, oldValue){
      _.forEach(vm.selected, function(v,k){
        vm.selected[k] = newValue;
      });
    });

    vm.loadProjects = function(){
      projects.get()
      .then(function(ps){
        vm.projects = ps;
        _.forEach(vm.projects, function(v){
          vm.selected[v.uuid] = false;
        });
        return auth.me();
      })
      .then(function(me){
        vm.me = me;
        if(me && me.id)vm.isAuthed = true;
      })
      .catch(function(err){
        if(err)
          toast.create("Error getting projects!", {bottom: true, center: true});
      });
    };
    vm.loadProjects();

    vm.go = function(uuid){
      $location.path('/project/' + uuid);
    }

    vm.login = function(){
      $window.location.href = 'http://docs.shingo.org:8085/auth/login';
    }

    vm.logout = function(){
      $window.location.href = 'http://docs.shingo.org:8085/auth/logout';
    }

    vm.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    vm.add = function(){
      dialog.create(AddController, 'templates/project/add-edit.tmpl.html')
      .then(function(project){
        return vm._add(project);
      })
      .then(function(p){
        vm.projects.push(p);
        vm.selected[p.uuid] = false;
        toast.create("Project, " + p.name + ", added!", {bottom: true, center: true});
      }).catch(function(err){
        if(err)
          toast.create("Error adding project!", {bottom: true, center: true});
      });
    }

    vm._add = function(project){
      return projects.post(project);
    }

    vm.delete = function(){
      var promises = [];
      _.forEach(vm.selected, function(v,k){
        if(v)
          promises.push(vm._delete(k));
      });
      $q.all(promises)
      .then(function(values){
        toast.create("Projects deleted!")
        vm.loadProjects();
      })
      .catch(function(err){
        toast.create("There was an error deleting the projects!");
      });
    }

    vm._delete = function(uuid){
      _.omit(vm.selected, uuid);
      return projects.delete(uuid);
    }
  }
})();
