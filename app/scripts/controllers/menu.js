'use strict';

angular.module('newChartEditorApp')
  .controller('MenuCtrl', function ($scope,$rootScope,$localStorage,$location) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.datasets = $localStorage.datasets;
    $scope.navType = 'pills';

    /** **/
    $scope.isActive = function (viewLocation) {
        return $rootScope.currentDataset === viewLocation;
      };

    /** **/
    $scope.setActive = function (viewLocation) {
		    $rootScope.currentDataset = viewLocation;
      };

    $rootScope.currentDataset = '';

    /** **/
    $scope.goNext = function (hash) {
        $rootScope.currentDataset = '';
        $location.path(hash);
      };

    /** Delete a DataSet **/
    $scope.deleteData = function(id){
        delete $localStorage.datasets[id];
        $location.path('/');
      };
  });
