'use strict';

angular.module('newChartEditorApp')
  .controller('NgTableCtrl', ['$scope', '$routeParams', '$localStorage','ngTableParams', '$filter',
   function($scope, $routeParams, $localStorage, ngTableParams, $filter) {
    
    var getData =function(){
      return $scope.data||[];
    };

    $scope.datasetId = $routeParams.datasetId;
    $scope.$storage = $localStorage.$default({ datasets: {} });

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 25           // count per page
      }, {
        total: function() { return getData().length; }, // length of data
        getData: function($defer, params, scope) {
          var filteredData = getData();
          var orderedData = filteredData;

          /**params.sorting() ?
                              $filter('orderBy')(filteredData, params.orderBy()) :
                              filteredData;**/
          params.total(orderedData.length)
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          },
      });
      
    if($scope.datasetId){
      var dataset = $scope.$storage.datasets[$scope.datasetId];
      if (typeof(dataset) !== 'undefined') {
        $scope.data = dataset.data;
        var titles = [];
        for (var i = 0; i < $scope.data[0].length; i++) {
          titles.push({ title:"col"+i, field:"col"+i });
        }
        $scope.titles = titles;
      }
    }
  }]);
