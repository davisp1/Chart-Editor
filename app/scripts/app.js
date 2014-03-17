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
  'angularCharts' // D3 Charts
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
      .when('/dataset/create', {
        templateUrl: 'views/dataset.html',
        controller: 'DataSetEditCtrl'
      })
      .when('/dataset/edit/:datasetId', {
        templateUrl: 'views/dataset.html',
        controller: 'DataSetEditCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(['$templateCache', function ($templateCache) {
      $templateCache.put('toto.html', '<tr> <th ng-repeat="column in titles" ng-class="{ \'sortable\': parse(column.sortable), \'sort-asc\': params.sorting()[parse(column.sortable)]==\'asc\', \'sort-desc\': params.sorting()[parse(column.sortable)]==\'desc\' }" ng-click="sortBy(column)" ng-show="column.show(this)" ng-init="template=column.headerTemplateURL(this)" class="header {{column.class}}"> <div ng-if="!template" ng-show="!template" ng-bind="parse(column.title)"></div> <div ng-if="template" ng-show="template"><div ng-include="template"></div></div> </th> </tr> <tr ng-show="show_filter" class="ng-table-filters"> <th ng-repeat="column in $columns" ng-show="column.show(this)" class="filter"> <div ng-repeat="(name, filter) in column.filter"> <div ng-if="column.filterTemplateURL" ng-show="column.filterTemplateURL"> <div ng-include="column.filterTemplateURL"></div> </div> <div ng-if="!column.filterTemplateURL" ng-show="!column.filterTemplateURL"> <div ng-include="\'ng-table/filters/\' + filter + \'.html\'"></div> </div> </div> </th> </tr>');
}]);