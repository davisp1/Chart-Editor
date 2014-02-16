'use strict';

/* Controllers */

var datasetControllers = angular.module('DataSetControllers', ['ngRoute',]);

datasetControllers.controller('DataSetListCtrl', ['$scope',
  function($scope) {
    console.log($scope);
  }]);

datasetControllers.controller('DataSetCreateCtrl', ['$scope', '$routeParams', '$rootScope',
   function($rootScope) {
    $rootScope.currenDataset = '';
  }]);

datasetControllers.controller('DataSetEditCtrl', ['$scope', '$routeParams', '$rootScope',
   function($scope, $routeParams, $rootScope) {
    $rootScope.currentDataset = $routeParams.datasetId;
    $scope.datasetId = $routeParams.datasetId;
  }]);
