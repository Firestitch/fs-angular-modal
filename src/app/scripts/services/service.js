(function () {
    'use strict';

    /**
     * @ngdoc interface
     * @name fs-angular-modal.services:fsModal
    */

    angular.module('fs-angular-modal')
    .factory('fsModal', function ($rootScope,$mdDialog) {
       var service = {
            show: show,
            hide: hide
        };

        return service;
        
        /**
         * @ngdoc method
         * @name show
         * @methodOf fs-angular-modal.services:fsModal
         * @param {string} controller The controller to be used
         * @param {string} view Template URL to the view
         * @param {object=} data This object will be injected in the controller with the namespace 'data'. Used to pass objects dirertly to the controller.
         * @param {object=} options That are passed to $mdDialog.show() to allow for full modal customization.
         * @description Wraps $mdDialog.show() function 
         */
        function show(controller, view, data, options) {
            
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
