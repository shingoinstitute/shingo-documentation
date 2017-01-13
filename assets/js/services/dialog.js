(function(){
  angular.module('ShingoDocumentationApp')
  .factory('dialog', ['$mdDialog', dialog]);

  function dialog($mdDialog){
    return {
      create: function(controller, template, ev, locals){
        return $mdDialog.show({
          controller: controller,
          templateUrl: template,
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: true,
          locals: locals
        })
      }
    }
  }
})();
