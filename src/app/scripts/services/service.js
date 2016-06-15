(function () {
    'use strict';

    
    /**
     * @ngdoc interface
     * @name fs-angular-modal.services:fsModal
    */

    angular.module('fs-angular-modal',[])
    .factory('fsModal', function ($rootScope,$mdDialog) {
        var service = {
            show: show,
            hide: hide,
            confirm: confirm
        }, modals = 0;

        return service;
        
        /**
         * @ngdoc method
         * @name show
         * @methodOf fs-angular-modal.services:fsModal
         * @param {string} controller The controller to be used
         * @param {string} view Template URL to the view
         * @param {object=} options That are passed to $mdDialog.show() to allow for full modal customization.
         * @description Wraps $mdDialog.show() function 
         */
        function show(controller, view, options) {
            
            options = options || {};
            
            var scope = $rootScope.$new(true);
            scope.hide = hide;
            scope.cancel = cancel;
          
            options.controller = controller;
            options.templateUrl = view;
            options.scope = scope;
            options.parent = angular.element(document.body);
            options.clickOutsideToClose = options.clickOutsideToClose===undefined ? true : false;

            return $mdDialog.show(options);
        }

        function hide(resolve) {
            return $mdDialog.hide(resolve);
        }

        function cancel(resolve) {
            return $mdDialog.cancel(resolve);
        }

        function confirm(options) {

            if(modals) {
                return;
            }
               
            modals++;

            var confirm = { template: [
                            '<md-dialog md-theme="{{ dialog.theme }}" aria-label="{{ dialog.ariaLabel }}" class="fs-modal-confirm {{ dialog.css }}">',
                            ' <md-dialog-content class="md-dialog-content" tabIndex="-1">',
                            '   <h2 class="md-title">{{ dialog.title }}</h2>',
                            '   {{dialog.mdTextContent || dialog.content}}',
                            ' </md-dialog-content>',
                            ' <md-dialog-actions>',
                            '   <md-button ng-click="dialog.cancel($event)">',
                            '     Cancel',
                            '   </md-button>',
                            '   <md-button ng-click="dialog.ok($event)" class="md-accent" md-autofocus="dialog.$type!=\'confirm\'">',
                            '     Yes',
                            '   </md-button>',
                            ' </md-dialog-actions>',
                            '</md-dialog>'
                            ].join('').replace(/\s\s+/g, ''),
                            controller: function () {
                                this.ok = function() {

                                    if(options.ok) {
                                        var result = options.ok();

                                        if(result && angular.isFunction(result.then)) {
                                            result.then(function() {
                                                $mdDialog.hide(true);
                                            });
                                        } else {
                                            $mdDialog.hide(true);
                                        }
                                    } else {
                                        $mdDialog.hide(true);
                                    }                          
                                };
                                this.cancel = function($event) {

                                    if(options.cancel) {
                                        var result = options.cancel();

                                        if(result && angular.isFunction(result.then)) {
                                            result.then(function() {
                                                $mdDialog.hide(false);
                                            });
                                        } else {
                                            $mdDialog.hide(false);
                                        }
                                    } else {
                                        $mdDialog.hide(false);
                                    }
                                };
                            },
                            preserveScope: true,
                            controllerAs: 'dialog',
                            bindToController: true,
                            title: options.title || 'Confirm',
                            content: options.content,
                            ariaLabel: 'Confirm',
                            skipHide: true,
                            onShowing: function($scope,container) {
                                angular.element(container).addClass('fs-modal-confirm-container');
                            }};

            $mdDialog.show(confirm)
            .then(function() {
                modals--;
            });
        }
    });
})();