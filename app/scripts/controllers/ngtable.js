'use strict';

angular.module('newChartEditorApp')
  .controller('NgTableCtrl', ['$scope', '$routeParams', '$localStorage','ngTableParams', '$filter', 'Fullscreen',
   function($scope, $routeParams, $localStorage, ngTableParams, $filter, Fullscreen) {
    
    var orderedData = [];
    var data = [];

    var getData =function(){
      return data||[];
    };

    $scope.getOrderedData = function(){
      return orderedData;
    };

    $scope.getCsvTitles = function(){
        return $scope.titles.map(function(d){ return d.title; });
      };
    
    $scope.isTooBig = function(){
      return orderedData.length <= 3000;
    };

    $scope.getTmpData = function(data){
      return angular.copy(data);
    };

    $scope.goFullscreen = function (id) {
      if (Fullscreen.isEnabled()){
        Fullscreen.cancel();
      }
      else{
        Fullscreen.enable( document.getElementById(id) );
      }
    };

    $scope.reload = function(){
      var dataset = $scope.$storage.datasets[$scope.datasetId];
      if (typeof(dataset) !== 'undefined') {
        $scope.data = dataset.data;
        $scope.titles = dataset.titles;
        $scope.tableParams.reload();
      }
    };

    $scope.saveData = function(data){
      $scope.$storage.datasets[$scope.datasetId].data = data;
    };

    $scope.saveTitles = function(titles){
      $scope.titles = titles;
      $scope.$storage.datasets[$scope.datasetId].titles = titles;
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
          var data = getData();
          var filteredata = ($scope.search && $scope.search.$.length>2) ? $filter('filter')( data, $scope.search) : data;
          orderedData = filteredata;
          /**params.sorting() ?
                              $filter('orderBy')(filteredData, params.orderBy()) :
                              filteredData;**/
          params.total(filteredata.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
      });

    if($scope.datasetId){
      
      var dataset = $scope.$storage.datasets[$scope.datasetId];
    
      if (typeof(dataset) !== 'undefined') {
        $scope.data = dataset.data;
        data = angular.copy($scope.data);
        $scope.titles = dataset.titles;
      }
    }
    
    $scope.$watch('search.$', function () {
      if($scope.search) {
        $scope.tableParams.reload();
      }
    });

  }]);
