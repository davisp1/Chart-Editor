'use strict';

angular.module('newChartEditorApp')
  .controller('NgTableCtrl', ['$scope', '$routeParams', '$localStorage','ngTableParams', '$filter',
   function($scope, $routeParams, $localStorage, ngTableParams) {

    var getData =function(){
      return $scope.data||[];
    };

    $scope.reload = function(){
      var dataset = $scope.$storage.datasets[$scope.datasetId];
      if (typeof(dataset) !== 'undefined') {
        $scope.data = dataset.data;
        $scope.titles = dataset.titles;
        $scope.tableParams.reload();
      }
    };

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

    $scope.saveTitles = function(){
      $scope.$storage.datasets[$scope.datasetId].titles = $scope.titles;
    };

    if($scope.datasetId){
      
      var dataset = $scope.$storage.datasets[$scope.datasetId];
    
      if (typeof(dataset) !== 'undefined') {
        $scope.data = dataset.data;
        $scope.titles = dataset.titles;
      }
    }

  }]);
