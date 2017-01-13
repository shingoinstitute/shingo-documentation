(function(){
  angular.module('ShingoDocumentationApp')
  .factory('toast', ['$mdToast', toast]);

  function toast($mdToast){
    return {
      create: function(message, position){
        if(!position){
          position = {
            bottom: false,
            top: true,
            left: false,
            right: false,
            center: true
          };
        }
        var pin = Object.keys(position)
          .filter(function(pos) { return position[pos]; })
          .join(' ');
        $mdToast.show(
          $mdToast.simple()
            .textContent(message)
            .position(pin)
            .hideDelay(3000)
        );
      }
    }
  }
})();
