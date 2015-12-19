(function () {
    'use strict';
    
	angular.module('fs-angular-modal',[]);


})();
(function () {
    'use strict';


})();
(function () {
    'use strict';


})();
(function () {
    'use strict';

    /**
     * @ngdoc interface
     * @name fs-angular-modal.services:fsModal
     * @description
     * 
     */

    angular.module('fs-angular-modal')
    .factory('fsModal', function () {
       var service = {
            show: show,
            hide: hide,
            open: open,
            close: hide
        };

        return service;
        
        /**
         * @ngdoc method
         * @name format
         * @methodOf fs-angular-modal.services:fsModal
         * @description Legacy function and should be migrated to open() function
         */        
        function show(event, view, data) {
            
            return $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {

                    $scope.data = data;
                    
                    $scope.hide = function() {
                        $mdDialog.hide();
                    };
                    $scope.cancel = function() {
                        $mdDialog.cancel();
                    };
                    $scope.answer = function(answer) {
                        $mdDialog.hide(answer);
                    };
                },
                templateUrl: view,
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose:true
            });
        }

        /**
         * @ngdoc method
         * @name format
         * @methodOf fs-angular-modal.services:fsModal
         * @param {string} controller The controller to be used
         * @param {string} view Template URL to the view
         * @param {object=} data This object will be injected in the controller with the namespace 'data'. Used to pass objects dirertly to the controller.
         * @param {object=} options That are passed to $mdDialog.show() to allow for full modal customization.
         * @description Wraps $mdDialog.show() function 
         */
        function open(controller, view, data, options) {
            
            options = options || {};
            
            var scope = $rootScope.$new(true);
            scope.hide = hide;
            scope.cancel = cancel;
          
            options.controller = controller;
            options.locals  = { data: data };
            options.templateUrl = view;
            options.scope = scope;
            options.parent = angular.element(document.body);
            options.clickOutsideToClose = options.clickOutsideToClose===undefined ? true : false;

            return $mdDialog.show(options);
        }
        
        function hide() {
            return $mdDialog.hide();
        }

        function cancel() {
            return $mdDialog.cancel();
        }
    });
})();

angular.module('fs-angular-modal').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/directives/directive.html',
    ""
  );

}]);
