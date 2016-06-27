'use strict';


angular.module('app')
  .controller('DemoCtrl', function ($scope, fsModal) {

    $scope.confirm = function() {
    	fsModal.confirm({ 	content: 'Are you sure?',
    						okLabel: 'Uhmmm, Yes!',
    						cancelLabel: 'ok Cancel!',
    						ok: function() {
    							alert('ok!');
    						}});
    }
});
