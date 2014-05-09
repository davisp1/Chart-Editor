'use strict';

angular.module('newChartEditorApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute', //routing
  'ngStorage', //localstorage
  'ui.bootstrap', //bootstrap 3
  'angularFileUpload', //FileUpload
  'ngTable', // Data Visualisation as table
  'ngAnimate-animate.css', // animate.css
  'angularCharts', // D3 Charts
  'ngCsv',
  'FBAngular',
  'colorpicker.module'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/dataset', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/chart', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/dataset/create', {
        templateUrl: 'views/dataset.html',
        controller: 'DataSetEditCtrl'
      })
      .when('/dataset/edit/:datasetId', {
        templateUrl: 'views/dataset.html',
        controller: 'DataSetEditCtrl'
      })
      .when('/chart/create', {
        templateUrl: 'views/chart.html',
        controller: 'ChartCtrl'
      })
      .when('/chart/edit/:chartId', {
        templateUrl: 'views/chart.html',
        controller: 'ChartCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });