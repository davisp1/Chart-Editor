"use strict";function removeAccents(a){a=a.split("");for(var b=[],c=a.length,d="ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž",e=["A","A","A","A","A","A","a","a","a","a","a","a","O","O","O","O","O","O","O","o","o","o","o","o","o","E","E","E","E","e","e","e","e","e","C","c","D","I","I","I","I","i","i","i","i","U","U","U","U","u","u","u","u","N","n","S","s","Y","y","y","Z","z"],f=0;c>f;f++)b[f]=-1!==d.indexOf(a[f])?e[d.indexOf(a[f])]:a[f];return b=b.join("")}function hasClass(a,b){for(var c=a.className.split(" "),d=0;d<c.length;d++)if(c[d].toLowerCase()===b.toLowerCase())return!0;return!1}angular.module("newChartEditorApp",["ngCookies","ngResource","ngSanitize","ngRoute","ngStorage","ui.bootstrap","angularFileUpload","ngTable"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/dataset/create",{templateUrl:"views/dataset_details.html",controller:"DataSetEditCtrl"}).when("/dataset/edit/:datasetId",{templateUrl:"views/dataset_details.html",controller:"DataSetEditCtrl"}).otherwise({redirectTo:"/"})}]).run(["$templateCache",function(a){a.put("toto.html",'<tr> <th ng-repeat="column in titles" ng-class="{ \'sortable\': parse(column.sortable), \'sort-asc\': params.sorting()[parse(column.sortable)]==\'asc\', \'sort-desc\': params.sorting()[parse(column.sortable)]==\'desc\' }" ng-click="sortBy(column)" ng-show="column.show(this)" ng-init="template=column.headerTemplateURL(this)" class="header {{column.class}}"> <div ng-if="!template" ng-show="!template" ng-bind="parse(column.title)"></div> <div ng-if="template" ng-show="template"><div ng-include="template"></div></div> </th> </tr> <tr ng-show="show_filter" class="ng-table-filters"> <th ng-repeat="column in $columns" ng-show="column.show(this)" class="filter"> <div ng-repeat="(name, filter) in column.filter"> <div ng-if="column.filterTemplateURL" ng-show="column.filterTemplateURL"> <div ng-include="column.filterTemplateURL"></div> </div> <div ng-if="!column.filterTemplateURL" ng-show="!column.filterTemplateURL"> <div ng-include="\'ng-table/filters/\' + filter + \'.html\'"></div> </div> </div> </th> </tr>')}]),angular.module("newChartEditorApp").controller("DataSetEditCtrl",["$scope","$routeParams","$rootScope","$upload","$localStorage","$location","ngTableParams","$filter","$compile",function(a,b,c,d,e,f){if(c.currentDataset=b.datasetId,a.datasetId=b.datasetId,a.$storage=e.$default({datasets:{}}),a.data=[],a.datasetTitle="",a.computeData=function(){a.jsonDataAsText=JSON.stringify(a.data,null,"	");var b=a.data.map(function(a){return a.join("	")}),c=b.join("\n");a.dataFromCopy=c},a.datasetId){var g=a.$storage.datasets[a.datasetId];"undefined"!=typeof g&&(a.data=g.data,a.datasetTitle=g.title||"",a.computeData())}a.onFileSelect=function(b){a.parseFile(b[0])},a.parseFile=function(b){if("undefined"!=typeof b){var c=new FileReader;c.onload=function(b){var c=b.target.result,d=d3.csv.parseRows(c.replace(/\s*;/g,","));a.data=d,a.computeData()},c.readAsText(b)}else alert("error");return!1},a.saveData=function(){var b="undefined"==typeof a.datasetId;b===!0&&(a.datasetId=removeAccents(a.datasetTitle)),a.$storage.datasets[a.datasetId]={title:a.datasetTitle,id:a.datasetId,data:a.data,titles:[]},b===!0&&f.path("/chart/edit/"+a.datasetId)},a.deleteData=function(){delete e.datasets[a.datasetId],f.path("/")}}]),angular.module("newChartEditorApp").controller("NgTableCtrl",["$scope","$routeParams","$localStorage","ngTableParams","$filter",function(a,b,c,d){var e=function(){return a.data||[]};if(a.datasetId=b.datasetId,a.$storage=c.$default({datasets:{}}),a.titles=[],a.tableParams=new d({page:1,count:10},{total:function(){return e().length},getData:function(a,b){var c=e(),d=c;b.total(d.length),a.resolve(d.slice((b.page()-1)*b.count(),b.page()*b.count()))}}),a.datasetId){var f=a.$storage.datasets[a.datasetId];if("undefined"!=typeof f){a.data=f.data;for(var g=[],h=0;h<a.data[0].length;h++)g.push({title:"col"+h,field:"col"+h});a.titles=g}}}]),angular.module("newChartEditorApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("newChartEditorApp").controller("MenuCtrl",["$scope","$rootScope","$localStorage","$location",function(a,b,c,d){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"],a.datasets=c.datasets,a.navType="pills",a.isActive=function(a){return b.currentDataset===a},a.setActive=function(a){b.currentDataset=a},b.currentDataset="",a.goNext=function(a){d.path(a)},a.deleteData=function(a){delete c.datasets[a],d.path("/")}}]);