'use strict';

angular.module('newChartEditorApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngStorage',
  'ui.bootstrap',
  'angularFileUpload',
  'ngTable'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/dataset/create', {
        templateUrl: 'views/dataset_details.html',
        controller: 'DataSetEditCtrl'
      })
      .when('/dataset/edit/:datasetId', {
        templateUrl: 'views/dataset_details.html',
        controller: 'DataSetEditCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
