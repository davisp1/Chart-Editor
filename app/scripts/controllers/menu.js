'use strict';

angular.module('newChartEditorApp')
  .controller('MenuCtrl', function ($scope,$rootScope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.datasets = [
      { title : 'data1', id : 'data1' },
      { title : 'data2', id : 'data2' }
    ];

    $scope.navType = 'pills';

    $scope.isActive = function (viewLocation) {
    	console.log( $rootScope.currentDataset)
        return $rootScope.currentDataset === viewLocation;
      };

    $scope.setActive = function (viewLocation) {
		    $rootScope.currentDataset = viewLocation;
      };

    $rootScope.currentDataset = '';
  });
