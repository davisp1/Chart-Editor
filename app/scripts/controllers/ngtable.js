'use strict';

angular.module('newChartEditorApp')
  .controller('NgTableCtrl', ['$scope', '$routeParams', '$localStorage','ngTableParams', '$filter',
   function($scope, $routeParams, $localStorage, ngTableParams) {

    var getData =function(){
      return $scope.data||[];
    };

    $scope.getTmpData = function(data){
      return angular.copy(data);
    };

    $scope.reload = function(){
      var dataset = $scope.$storage.datasets[$scope.datasetId];
      if (typeof(dataset) !== 'undefined') {
        $scope.data = dataset.data;
        $scope.titles = dataset.titles;
        $scope.tableParams.reload();
      }
    };

    $scope.saveTitles = function(titles){
      $scope.titles = titles;
      $scope.$storage.datasets[$scope.datasetId].titles = titles;
      //$scope.$apply()
    };

    $scope.saveData = function(data){
      $scope.$storage.datasets[$scope.datasetId].data = data;
    }

    $scope.datasetId = $routeParams.datasetId;
    $scope.$storage = $localStorage.$default({ datasets: {} });
    $scope.titles = [];

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10           // 10 per page
      }, {
        total: function() { return getData().length; }, // length of data
        getData: function($defer, params) {
          var filteredData = getData();
          var orderedData = filteredData;

          /**params.sorting() ?
                              $filter('orderBy')(filteredData, params.orderBy()) :
                              filteredData;**/
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
      });

    if($scope.datasetId){
      
      var dataset = $scope.$storage.datasets[$scope.datasetId];
    
      if (typeof(dataset) !== 'undefined') {
        $scope.data = dataset.data;
        $scope.titles = dataset.titles;
      }
    }

  }]);
