'use strict';

angular.module('newChartEditorApp')
  .controller('MenuCtrl', function ($scope,$rootScope,$localStorage,$location) {

    $scope.datasets = $localStorage.datasets;
    $scope.navType = 'pills';

    /** **/
    $scope.isActive = function (viewLocation) {
        var paths = $location.path().split('/');
        var id = paths[paths.length - 1];
        return id === viewLocation;
      };

    $scope.isMenuActive = function (viewLocation) {
        console.log($location.path().indexOf(viewLocation) > -1);
        return $location.path().indexOf(viewLocation) > -1;
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
