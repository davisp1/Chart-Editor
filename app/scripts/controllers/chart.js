'use strict';

angular.module('newChartEditorApp')
  .controller('ChartCtrl', function ($scope, $routeParams, $rootScope, $localStorage) {

    $rootScope.currentChart = $routeParams.chartId;
    $scope.chartId = $routeParams.chartId;
    $scope.$storage = $localStorage.$default({ charts: {} });
    $scope.datasets = $scope.$storage.datasets;
    $scope.kindCharts = ['bar', 'pie', 'line', 'area', 'point'];
    $scope.kindLegend = ['lineEnd', 'traditional'];
    $scope.sharedData = { 
        dataset: '', 
        valueColumns: [{ id: '', value: ''}], 
        titleColumn: '', 
        chartType: 'bar' 
      };

    if($scope.chartId){
      $scope.chart = $scope.$storage.charts[$scope.chartId];
      if (typeof($scope.chart) !== 'undefined') {
      }
    }

    $scope.config = {
        title : 'New Chart',
        tooltips: true,
        labels : false,
        mouseover: function() {},
        mouseout: function() {},
        click: function() {},
        legend: {
          display: true,
          //could be 'left, right'
          position: 'right'
        },
        colors: ['steelBlue', 'rgb(255,153,0)', 'rgb(220,57,18)', 'rgb(70,132,238)', 'rgb(73,66,204)', 'rgb(0,128,0)'],
        innerRadius: 0, // Only on pie Charts
        lineLegend: 'lineEnd', // Only on line Charts
    };

    $scope.data1 = {
        series: [],
        data : []
      };

    $scope.computeData = function(){

        var series = [];
        var seriesId = [];

        var data = [];

        var labelColumn = $scope.sharedData.titleColumn;
        var valueColumns = $scope.sharedData.valueColumns;
        var titles = $scope.sharedData.dataset.titles;

        if (angular.isDefined(labelColumn) && valueColumns.length > 0) {

          for (var i = 0; i < valueColumns.length; i++) {
            var column = valueColumns[i];
            series.push(column.value);
            seriesId.push(titles.indexOf(column.id));
          }

          labelColumn = titles.indexOf(labelColumn);

          angular.forEach($scope.sharedData.dataset.data, function(value){
              var y = [];
              for (var i = 0; i < seriesId.length; i++) {
                console.log(parseFloat(value[seriesId[i]]));
                y.push(parseFloat(value[seriesId[i]]));
              }
              this.push({ x: value[labelColumn]||0, y: y});
            }, data);

        }
        $scope.data1 = { series: series, data: data };
      };

    $scope.saveData = function(){
      $scope.$storage.charts[$scope.chartId] = { config: $scope.config, labels: $scope.labels, values: $scope.values };
    };
  });