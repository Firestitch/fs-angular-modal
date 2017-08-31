'use strict';



angular.module('app')

  .controller('DemoCtrl', function ($scope, fsModal, $q) {


    $scope.confirm = function() {

        fsModal.confirm(
            {
                content: 'Are you sure?',
                okLabel: 'Uhmmmm, ok',
                cancelLabel: 'Ya cancel',
                ok: function() {
                    alert('ok!');

                    return $q(function(resolve) {
                        resolve('ok');
                    });
                },
                cancel: function() {
                    alert('cancel!');

                    return $q(function(resolve) {
                        resolve('cancel');
                    });
                }
            }
        )
        .then(
            // Ok clicked
            function(value) {
                console.log(value);
            },
            // Cancel clicked
            function(reason) {
                console.log(reason);
            }
        );
    }

    $scope.modal = function() {

        fsModal.show(
            '',
            'views/modal.html',
            {
            	confirm: {
            		message: "You have unsaved changes.",
            		okLabel: "THAT'S OK, CONTINUE",
            		cancelLabel: "TAKE ME BACK",
            	}
            }).then(function(value){
            		//was saved
	        	},
	        	function(value){
	        		//was cancelled
	        	}
	        );
            ;
    }

    $scope.prompt = function() {

        fsModal
        .prompt({
        	label: 'Please enter the email addresses',
        	width: '500px',
        	hint: 'hint text'
        })
        .then(function(value) {
        	debugger;
    		//was saved
    	},
    	function(value){
    		debugger;
    		//was cancelled
    	});
    }

    $scope.promptAutocomplete = function() {

        fsModal
        .prompt({
        	label: 'Please autocomplete',
        	width: '500px',
        	type: 'autocomplete',
        	values: function() {
        		return $q(function(resolve) {
        			resolve([{ name: 'name', value: 'value' },{ name: 'name', value: 'value' }]);
        		});
        	}
        })
        .then(function(value) {
        	debugger;
    		//was saved
    	},
    	function(value){
    		debugger;
    		//was cancelled
    	});
    }

    $scope.promptSelect = function() {

        fsModal
        .prompt({
        	label: 'Please select',
        	width: '500px',
        	hint: 'hint text',
        	type: 'select',
        	values: function() {
        		return $q(function(resolve) {
        			resolve([{ name: 'name', value: 'value' },{ name: 'name', value: 'value' }]);
        		});
        	}
        })
        .then(function(value) {
        	debugger;
    		//was saved
    	},
    	function(value){
    		debugger;
    		//was cancelled
    	});
    }

});

