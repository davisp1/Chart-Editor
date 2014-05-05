'use strict';

angular.module('newChartEditorApp')
  .controller('ChartCtrl', function ($scope, $routeParams, $window, $rootScope, $localStorage) {

    $rootScope.currentChart = $routeParams.chartId;
    $scope.chartId = $routeParams.chartId;
    $scope.$storage = $localStorage.$default({ charts: {} });
    $scope.datasets = $scope.$storage.datasets;

    $scope.chart = [];
    $scope.series = [];
    $scope.title = '';
    $scope.$window = $window;
    $scope.example = true;
    $scope.kindCharts = ['bar', 'pie', 'line', 'area', 'point'];
    $scope.data = [];
    $scope.dataset = '';
    $scope.labels = '';

    if($scope.chartId){
      $scope.chart = $scope.$storage.datasets[$scope.chartId];
      if (typeof($scope.chart) !== 'undefined') {
      }
    }

    $scope.$watch('dataset', function() {
        $scope.datasetObject= $scope.dataset;
        $scope.datasetColumns = (angular.isDefined($scope.datasetObject)) ? $scope.datasetObject.titles : [];
        console.log($scope.datasetColumns);
      });
    
    $scope.data1 = {
        series: ['Sales', 'Income', 'Expense', 'Laptops', 'Keyboards'],
        data : []
      };

    $scope.computeData = function(){
        var series = [];
        var data = [];
        var labelColumn = $scope.labels;
        var valueColumn = $scope.values;
        if (angular.isDefined(labelColumn) && angular.isDefined(valueColumn)) {
          angular.forEach($scope.dataset.data, function(value, key){
              console.log(value + key);
            }, data);
        }
        $scope.data1 = { series: series, data: data };
      };

    $scope.chartType = 'bar';

    $scope.config = {
        labels: false,
        title : 'Not Products',
        example : $scope.example,
        legend : {
            display:true,
            position:'right'
          }
        };
    angular.element($window).bind('resize',function(e){ console.log(e);$scope.example=!$scope.example;$scope.config.example=$scope.example;});
  });