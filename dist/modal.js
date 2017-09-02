



(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name fs.fsModal
    */


    angular.module('fs-angular-modal',['fs-angular-element'])
    .factory('fsModal', function ($rootScope, $mdDialog, $q,$timeout) {
        var service = {
            show: show,
            hide: hide,
            confirm: confirm,
            cancel: cancel,
            prompt: prompt
        }, modals = 0,
        modalOptions = {};

		var oldcancel = $mdDialog.cancel;

        $mdDialog.cancel = function (reason, options) {
        	if(modalOptions.confirm && modalOptions.container.find('form').hasClass('ng-dirty')) {
		        service.confirm(
		            {
		                content: modalOptions.confirm.message ? modalOptions.confirm.message : "You have unsaved changes.",
		                okLabel: modalOptions.confirm.okLabel ? modalOptions.confirm.okLabel : "THAT'S OK, CONTINUE",
		                cancelLabel: modalOptions.confirm.cancelLabel ? modalOptions.confirm.cancelLabel : "TAKE ME BACK",
		                ok: function() {
		                	$timeout(function(){ oldcancel(reason, options); });
		                },
		                cancel: function() {
		                }
		            });
			    return false;
        	}

        	return oldcancel(reason, options);
    	  }


        return service;

        /**
         * @ngdoc method
         * @name show
         * @methodOf fs.fsModal
         * @description Wraps $mdDialog.show() function
         * @param {string} controller The controller to be used
         * @param {string} view Template URL to the view
         * @param {object} options That are passed to $mdDialog.show() to allow for full modal customization.
         * @param {boolean} [options.clickOutsideToClose=true] close if click happens outside popup
         * @param {object} options.confirm options to show confirm dialog before cancelling an unsaved form
         * @param {string} [options.confirm.message='You have unsaved changes.'] confirm dialog message
         * @param {string} [options.confirm.okLabel='THAT'S OK, CONTINUE'] confirm dialog ok button label
         * @param {string} [options.confirm.cancelLabel='TAKE ME BACK'] confirm dialog cancel button label
		 * @example
		 * <pre>
		fsModal.show(
			'ExampleController',
			'views/modal/example.html',
			{
				clickOutsideToClose: true,
				confirm: {
					message: 'Do you want to save stuff?',
					okLabel: 'Save Stuff',
					cancelLabel: 'Dont Save Stuff',
				}
			}
		}).then(
			function(){
				//dialog was closed but not cancelled (.hide() was called, probally by save button)
				console.log('save stuff');
			},
			function(){
				//dialog was cancelled
				console.log('dont save stuff');
			}
		);
		 * </pre>
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

			options.onShowing = function($scope,container,options,d,e) {
				modalOptions.container = container;
			}

            if(options.confirm) {
            	modalOptions.confirm = options.confirm;
            }

            return $mdDialog.show(options);
        }

        /**
         * @ngdoc method
         * @name hide
         * @methodOf fs.fsModal
         * @param {object} resolve description
         * @description Wraps $mdDialog.hide() function
         */
        function hide(resolve) {
            return $mdDialog.hide(resolve);
        }

        /**
         * @ngdoc method
         * @name cancel
         * @methodOf fs.fsModal
         * @param {object} resolve description
         * @description Wraps $mdDialog.cancel() function
         */
        function cancel(resolve) {
            return $mdDialog.cancel(resolve);
        }

        /**
         * @ngdoc method
         * @name confirm
         * @methodOf fs.fsModal
		 * @description show a confirm dialog
         * @param {object} options options object
         * @param {string} options.content confirm dialog message
         * @param {string} options.width The width for the modal
         * @param {string} options.class The css class to apply to md-dialog
         * @param {string} [options.title='Confirm'] title
         * @param {string} [options.okLabel='Yes'] ok button label
         * @param {string} [options.cancelLabel='Cancel'] cancel button label
         * @param {function} options.ok callback function run when ok button pressed
         * @param {function} options.cancel callback function run when cancel button pressed
		 * @example
		 * <pre>
		fsModal.confirm({
			title: 'Save?',
			content: 'Do you want to save stuff?',
			okLabel: 'Save Stuff',
			cancelLabel: 'Dont Save Stuff',
			ok: function() { console.log('saving stuff'); },
			cancel: function() { console.log('not saving stuff'); }
		});
		 * </pre>
         */
        function confirm(options) {

        	options.title 		= options.title===undefined ? 'Confirm' : options.title;
        	options.class 		= options.class===undefined ? 'fs-modal-confirm' : options.class;
        	options.focusOnOpen = options.focusOnOpen===undefined ? true : options.focusOnOpen;

            return $q(function(resolve,reject) {

            	if(modals) {
	                return reject();
	            }

	            modals++;

           		var confirm = {
           			template: [
	                    '<md-dialog md-theme="{{ dialog.theme }}" aria-label="{{ dialog.ariaLabel }}" class="{{ dialog.options.class }}" ng-style="dialog.style">',
	                    ' <form ng-submit="dialog.ok($event)">',
	                    '  <md-dialog-content tabIndex="-1">',
	                    '   <div class="md-dialog-content">',
	                    '    <h2 class="md-title" ng-if="dialog.options.title">{{ dialog.options.title }}</h2>',
	                         options.content,
	                    '   </div>',
	                    '  </md-dialog-content>',
	                    '  <md-dialog-actions>',
	                    '   <md-button ng-click="dialog.cancel($event)">{{dialog.cancelLabel}}</md-button>',
	                    '   <md-button class="md-accent" type="submit">{{dialog.okLabel}}</md-button>',
	                    '  </md-dialog-actions>',
	                    ' </form>',
	                    '</md-dialog>'
	                    ].join(''),
                    controller: ['$scope',function($scope) {

                    	angular.extend(this,options.controller);

                    	this.style = { maxWidth: '100%' };
                    	if(options.width)
                    		this.style.width = options.width;

                        this.ok = function($event) {

                            var result = undefined;
                            if(options.ok)
                                result = options.ok($event,$scope);

                            $q(function(resolve) {
                                // resolve() accepts promises as well and recpects them.
                                resolve(result);
                            })
                            .then(function(value) {
                                // hide() returns promise that is resolved when the dialog has been closed.
                                $mdDialog.hide(value).then(function() {
                                    resolve(value);
                                });
                            })
                            // in case if rejected promise was retured from options.ok()
                            .catch(function(reason) {
                                $mdDialog.hide(reason).then(function() {
                                    resolve(reason);
                                });
                            });
                        };

                        this.cancel = function($event) {

                            $q(function(cancelResolve) {
                            	var result = undefined;

                                if(options.cancel) {
                                    result = options.cancel($event,$scope);
                                }

                                if(angular.isObject(result) && result.then) {
                                	result.then(cancelResolve);

                                } else {
                                	cancelResolve(result);
                                }
                            })
                            .then(function(result) {
								$mdDialog.hide(result)
								.then(function() {
                                    reject(result);
                                });
                            })
                        }
                    }],
                    preserveScope: true,
                    controllerAs: 'dialog',
                    bindToController: true,
                    options: options,
                    ariaLabel: 'Confirm',
                    focusOnOpen: options.focusOnOpen,
                    multiple: true,
                    locals: {
                        okLabel: options.okLabel || 'Yes',
                        cancelLabel: options.cancelLabel || 'Cancel'
                    },
                    onShowing: function($scope,container) {
                        angular.element(container).addClass('fs-modal-confirm-container');
                    },
                    resolve: options.resolve
                };

	            $mdDialog.show(confirm).finally(function(result) {
	            	modals--;
	                return result;
	            });
            });
        }

		/**
         * @ngdoc method
         * @name prompt
         * @methodOf fs.fsModal
		 * @description show a prompt dialog
         * @param {object} options options object
         * @param {string} options.label Label to the interface
         * @param {string} options.hint Interface hint
         * @example
         */
        function prompt(options) {

        	options.type = options.type || 'input';
        	options.resolve = options.resolve || {};
        	options.template = options.template ? options.template : '<span md-highlight-text="search" md-highlight-flags="^i">{{item.name}}</span>';
        	var content = '';

        	if(options.type=='input') {
        		content = '<md-input-container class="md-block"><label>{{dialog.options.label}}</label><input type="text" ng-model="value" fs-element-focus><div class="hint">{{dialog.options.hint}}</div></md-input-container>';
        	} else if(options.type=='select') {
        		content = '<md-input-container class="md-block">\<label>{{dialog.options.label}}</label><md-select ng-model="value"><md-option ng-repeat="item in dialog.values" ng-value="item.value">{{item.name}}</md-option></md-select><div class="hint">{{dialog.options.hint}}</div></md-input-container>';
        		options.resolve.values = options.values;
        	} else if(options.type=='autocomplete') {
        		content = '<md-autocomplete-container>\
					        <md-autocomplete\
					                md-no-cache="true"\
					                md-selected-item="dialog.autocomplete.item"\
					                md-search-text="dialog.autocomplete.search"\
					                md-items="item in dialog.autocompleteQuery(dialog.autocomplete.search)"\
					                md-item-text="item.name"\
					                md-selected-item-change="dialog.autocompleteChange(dialog.autocomplete.item)"\
					                md-min-length="0"\
					                md-delay="300"\
					                md-autoselect\
					                md-floating-label="{{dialog.options.label}}">\
					                <md-item-template>' + options.template + '</md-item-template>\
					                <md-not-found>No matches found</md-not-found>\
					        </md-autocomplete>\
					      </md-autocomplete-container>'
        	}

        	var value = undefined;
        	return confirm(angular.merge({
        		okLabel: 'OK',
        		title: '',
        		focusOnOpen: false,
        		class: (options.class || '') + ' fs-modal-prompt',
        		content: content,
        		ok: function($event, $scope) {
        			return value
        		},
        		controller: {
        			autocompleteChange: function(item) {
	        			value = item;
	        		},
	        		autocompleteQuery: function(search) {
	        			return options.values(search);
	        		}
	        	},
        		resolve: options.resolve
        	},options));


        }
    });
})();
