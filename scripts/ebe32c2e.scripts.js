"use strict";function hasClass(a,b){for(var c=a.className.split(" "),d=0;d<c.length;d++)if(c[d].toLowerCase()===b.toLowerCase())return!0;return!1}function removeAccents(a){a=a.split("");for(var b=[],c=a.length,d="ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž",e=["A","A","A","A","A","A","a","a","a","a","a","a","O","O","O","O","O","O","O","o","o","o","o","o","o","E","E","E","E","e","e","e","e","e","C","c","D","I","I","I","I","i","i","i","i","U","U","U","U","u","u","u","u","N","n","S","s","Y","y","y","Z","z"],f=0;c>f;f++)b[f]=-1!==d.indexOf(a[f])?e[d.indexOf(a[f])]:a[f];return b=b.join("")}angular.module("newChartEditorApp",["ngCookies","ngResource","ngSanitize","ngRoute","ngStorage","ui.bootstrap","angularFileUpload","ngTable","ngAnimate-animate.css"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/dataset",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/dataset/create",{templateUrl:"views/dataset.html",controller:"DataSetEditCtrl"}).when("/dataset/edit/:datasetId",{templateUrl:"views/dataset.html",controller:"DataSetEditCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("newChartEditorApp").controller("DataSetEditCtrl",["$scope","$routeParams","$rootScope","$upload","$localStorage","$location","ngTableParams","$filter","$compile","$timeout",function(a,b,c,d,e,f,g,h,i,j){if(c.currentDataset=b.datasetId,a.datasetId=b.datasetId,a.$storage=e.$default({datasets:{}}),a.data=[],a.titles=[],a.computeData=function(){a.jsonDataAsText=JSON.stringify(a.data,null,"	");var b=a.data.map(function(a){return a.join("	")}),c=b.join("\n");a.dataFromCopy=c},a.datasetId){var k=a.$storage.datasets[a.datasetId];"undefined"!=typeof k&&(a.data=k.data,a.datasetTitle=k.title||"",j(function(){a.titles=k.titles},200))}a.onFileSelect=function(b){a.parseFile(b[0])},a.getFormatTitles=function(a,b){for(var c=[],d=0;d<b[0].length;d++){var e={};e="undefined"==typeof a[d]?{title:"col"+d,field:"col"+d}:"undefined"!=typeof a[d].title?a[d]:{title:a[d],field:"col"+d},c.push(e)}return c},a.parseFile=function(b){if("undefined"!=typeof b){var c=new FileReader;c.onload=function(b){var c=b.target.result,d=d3.csv.parseRows(c.replace(/\s*;/g,","));a.datacsv=d},c.readAsText(b)}else alert("error");return!1},a.saveData=function(){var b="undefined"==typeof a.datasetId;b===!0&&(a.datasetId=removeAccents(a.datasetTitle));var c=a.data,d=a.titles;if("json"===a.checkModel)try{c=jQuery.parseJSON(a.jsonDataAsText),d=a.getFormatTitles([],c)}catch(e){return alert("error "+e),!1}else if("csv"===a.checkModel){c=a.datacsv;var g=a.hasTitles?c.shift():[];d=a.getFormatTitles(g,c)}a.$storage.datasets[a.datasetId]={title:a.datasetTitle,id:a.datasetId,data:c,titles:d},a.data=c,a.titles=d,b===!0?f.path("/dataset/edit/"+a.datasetId):a.data.length>0&&angular.element("#dataset_tableview").scope()&&(a.computeData(),angular.element("#dataset_tableview").scope().reload())},a.deleteData=function(){delete e.datasets[a.datasetId],f.path("/")}}]),angular.module("newChartEditorApp").controller("NgTableCtrl",["$scope","$routeParams","$localStorage","ngTableParams","$filter",function(a,b,c,d){var e=function(){return a.data||[]};if(a.reload=function(){var b=a.$storage.datasets[a.datasetId];"undefined"!=typeof b&&(a.data=b.data,a.titles=b.titles,a.tableParams.reload())},a.datasetId=b.datasetId,a.$storage=c.$default({datasets:{}}),a.titles=[],a.tableParams=new d({page:1,count:10},{total:function(){return e().length},getData:function(a,b){var c=e(),d=c;b.total(d.length),a.resolve(d.slice((b.page()-1)*b.count(),b.page()*b.count()))}}),a.saveTitles=function(){a.$storage.datasets[a.datasetId].titles=a.titles},a.datasetId){var f=a.$storage.datasets[a.datasetId];"undefined"!=typeof f&&(a.data=f.data,a.titles=f.titles)}}]),angular.module("newChartEditorApp").controller("MainCtrl",function(){}),angular.module("newChartEditorApp").controller("MenuCtrl",["$scope","$rootScope","$localStorage","$location",function(a,b,c,d){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"],a.datasets=c.datasets,a.navType="pills",a.isActive=function(a){return b.currentDataset===a},a.setActive=function(a){b.currentDataset=a},b.currentDataset="",a.goNext=function(a){b.currentDataset="",d.path(a)},a.deleteData=function(a){delete c.datasets[a],d.path("/")}}]);