'use strict';

angular.module('newChartEditorApp')
  .controller('ChartCtrl', function ($scope, $routeParams, $rootScope, $localStorage, $location) {

    $rootScope.currentChart = $routeParams.chartId;
    $scope.chartId = $routeParams.chartId;
    $scope.$storage = $localStorage.$default({ charts: {} });
    $scope.datasets = $scope.$storage.datasets;
    $scope.kindCharts = ['bar', 'pie', 'line', 'area', 'point'];
    $scope.kindLegend = ['lineEnd', 'traditional'];

    if($scope.chartId){
        var chart = $scope.$storage.charts[$scope.chartId];
        if (angular.isDefined(chart)) {
          $scope.sharedData = angular.copy(chart.sharedData);
          $scope.config = angular.copy(chart.config);
        }
    }
    else{
        $scope.sharedData = { 
            dataset: '', 
            valueColumns: [{ id: '', value: ''}], 
            titleColumn: '', 
            chartType: 'bar' 
          };

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
    }

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
        var dataset = $scope.datasets[$scope.sharedData.dataset];

        if (angular.isDefined(dataset) && angular.isDefined(labelColumn) && valueColumns.length > 0) {

          var titles = dataset.titles;
          var titlesDict = {};
          for (var i = 0; i < titles.length; i++) {
            titlesDict[titles[i].field] = titles[i];
          }

          labelColumn = titlesDict[labelColumn].index;

          for (var i = 0; i < valueColumns.length; i++) {
            var column = valueColumns[i];
            var title = titlesDict[column.id];
            series.push(column.value);
            seriesId.push(title.index);
          }

          angular.forEach(dataset.data, function(value){
              var y = [];
              for (var i = 0; i < seriesId.length; i++) {
                var yTmp = parseFloat(value[seriesId[i]]);
                yTmp = (!isNaN(yTmp)) ? yTmp : 0.0;
                y.push(yTmp);
              }
              this.push({ x: value[labelColumn]||0, y: y});
            }, data);
        }
        $scope.data1 = { series: series, data: data };
      };

    /**
    * Save data function
    */
    $scope.saveData = function(){
      
      if (!angular.isDefined($scope.chartId)){
          $scope.chartId = normalize($scope.config.title);
      }

      $scope.$storage.charts[$scope.chartId] = {  
            id: $scope.chartId, 
            config: $scope.config, 
            sharedData: $scope.sharedData
        };
      
      $location.path('/chart/edit/' + $scope.chartId);
    };

    $scope.deleteData = function(){
        delete $localStorage.charts[$scope.chartId];
        $location.path('/');
      };

    $scope.computeData();
  });