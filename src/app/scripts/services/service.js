(function () {
    'use strict';

    /**
     * @ngdoc interface
     * @name fs-angular-modal.services:fsModal
    */

    angular.module('fs-angular-modal',[])
    .factory('fsModal', function ($rootScope, $mdDialog, $q) {
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

            var defer = $q.defer();

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
                                    var result = undefined;

                                    if(options.ok)
                                        result = options.ok();

                                    $q(function(resolve) {
                                        // resolve() accepts promises as well and recpects them.
                                        resolve(result ? result : true);
                                    })
                                    .then(function(value) {
                                        // hide() returns promise that is resolved when the dialog has been closed.
                                        $mdDialog.hide(value).then(function() {
                                            defer.resolve(value);
                                        });
                                    })
                                    // in case if rejected promise was retured from options.ok()
                                    .catch(function(reason) {
                                        $mdDialog.hide(reason).then(function() {
                                            defer.resolve(reason);
                                        });
                                    });
                                };

                                this.cancel = function($event) {
                                    var result = undefined;

                                    if(options.cancel)
                                        result = options.cancel();

                                    $q(function(resolve) {
                                        resolve(result ? result : false);
                                    })
                                    .then(function(value) {
                                        $mdDialog.hide(value).then(function() {
                                            defer.reject(value);
                                        });
                                    })
                                    // in case if rejected promise was retured from options.cancel()
                                    .catch(function(reason) {
                                        $mdDialog.hide(reason).then(function() {
                                            defer.reject(reason);
                                        });
                                    });
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

            $mdDialog.show(confirm).then(function(result) {
                modals--;
                return result;
            });

            return defer.promise;
        }
    });
})();