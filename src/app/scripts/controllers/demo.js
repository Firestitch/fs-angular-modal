'use strict';


angular.module('app')
  .controller('DemoCtrl', function ($scope, fsModal) {

    $scope.confirm = function() {
    	fsModal.confirm({ 	content: 'Are you sure?',
    						ok: function() {
    							alert('ok!');
    						}});
    }
});
