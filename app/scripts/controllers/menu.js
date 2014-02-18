'use strict';

angular.module('newChartEditorApp')
  .controller('MenuCtrl', function ($scope,$rootScope,$localStorage,$location) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.datasets = $localStorage.datasets;
    console.log($scope.datasets);
    $scope.navType = 'pills';

    $scope.isActive = function (viewLocation) {
        console.log( $rootScope.currentDataset);
        return $rootScope.currentDataset === viewLocation;
      };

    $scope.setActive = function (viewLocation) {
		    $rootScope.currentDataset = viewLocation;
      };

    $rootScope.currentDataset = '';

    $scope.goNext = function (hash) {
        $location.path(hash);
      };
  });
