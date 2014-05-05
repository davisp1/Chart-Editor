'use strict';

angular.module('newChartEditorApp')
  .controller('ChartCtrl', function ($scope, $routeParams, $window, $rootScope, $localStorage) {
  	$rootScope.currentChart = $routeParams.chartId;
    $scope.chartId = $routeParams.chartId;
    $scope.$storage = $localStorage.$default({ charts: {} });
    $scope.chart = [];
    
    if($scope.chartId){
      $scope.chart = $scope.$storage.datasets[$scope.chartId];
      if (typeof($scope.chart) !== 'undefined') {
 	  }
 	}
    
    $scope.data = [];
    
    $scope.dataset = "";
    $scope.labels = "";
	$scope.datasets = $scope.$storage.datasets; 

  	$scope.$watch('dataset', function() {
    	$scope.datasetObject= $scope.dataset;
    	$scope.datasetColumns = (angular.isDefined($scope.datasetObject)) ? $scope.datasetObject.titles : [];
    	console.log($scope.datasetColumns);
	});

    $scope.series = [];
    $scope.title = "";
    $scope.$window = $window;
    $scope.example=true;
    
    $scope.kindCharts=['bar', 'pie', 'line', 'area', 'point'];
	
	//$scope.labels = 
	
	$scope.data1 = {
		series: ['Sales', 'Income', 'Expense', 'Laptops', 'Keyboards'],
		data : []     
	}

	$scope.computeData = function(){
		console.log("begin");
		var series = [];
		var data = [];
		var label_column = $scope.labels;
		var value_column = $scope.values;
		console.log(label_column);
		console.log(value_column);
		if (angular.isDefined(label_column) && angular.isDefined(value_column)) {
			console.log("before looping")
		     angular.forEach($scope.dataset.data, function(value, key){
		       //this.push(key + ': ' + value);
		       console.log(value);
		     }, data);
		}
		$scope.data1 = { series: series, data: data }
		console.log("end");
	};

	$scope.chartType = 'bar';

	$scope.config = {
		labels: false,
		title : "Not Products",
		example : $scope.example,
		legend : {
			display:true,
			position:'right'
		}
	}
    angular.element($window).bind('resize',function(e){ console.log("jfksldkfjsdlfksj");$scope.example=!$scope.example;$scope.config.example=$scope.example});
  });