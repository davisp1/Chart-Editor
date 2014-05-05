'use strict';

function removeAccents(strAccents) {
    strAccents = strAccents.split('');
    var strAccentsOut = [];
    var strAccentsLen = strAccents.length;
    var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    var accentsOut = ['A','A','A','A','A','A','a','a','a','a','a','a','O','O','O','O','O','O','O','o','o','o','o','o','o','E','E','E','E','e','e','e','e','e','C','c','D','I','I','I','I','i','i','i','i','U','U','U','U','u','u','u','u','N','n','S','s','Y','y','y','Z','z'];
    for (var y = 0; y < strAccentsLen; y++) {
      if(accents.indexOf(strAccents[y]) !== -1) {
        strAccentsOut[y] = accentsOut[accents.indexOf(strAccents[y])];
      }
      else{
        strAccentsOut[y] = strAccents[y];
      }
    }
    strAccentsOut = strAccentsOut.join('');
    return strAccentsOut;
  }

angular.module('newChartEditorApp')
   .controller('DataSetEditCtrl', ['$scope', '$routeParams', '$rootScope', '$upload', '$localStorage','$location', 'ngTableParams', '$filter', '$compile', '$timeout',
   function($scope, $routeParams, $rootScope, $upload, $localStorage, $location, ngTableParams, $filter, $compile, $timeout) {
        $rootScope.currentDataset = $routeParams.datasetId;
        $scope.datasetId = $routeParams.datasetId;
        $scope.$storage = $localStorage.$default({ datasets: {} });
        $scope.data = [];
        $scope.titles = [];

        $scope.computeData = function(){
            $timeout(function(){
                $scope.jsonDataAsText = JSON.stringify($scope.data,null,'\t');
                var lines = $scope.data.map(function(element){ return element.join('\t'); });
                var text = lines.join('\n');
                $scope.dataFromCopy = text;
              }, 1000);
          };

        $scope.onFileSelect = function($files) {
            parseFile($files[0]);
          };

        $scope.getFormatTitles = function(currentTitles, data){
          var titles = [];

          for (var i = 0; i < data[0].length; i++) {
            var title;
            if(angular.isDefined(currentTitles[i])){
              title = { title: 'col' + i, field: 'col' + i, index: i };
            }
            else{
              title = (!angular.isDefined(currentTitles[i].title)) ? currentTitles[i] : { title: currentTitles[i], field: 'col' + i, index: i};
            }
            titles.push(title);
          }
          return titles;
        };

        var parseFile = function(file){
            if (angular.isDefined(file)) {
              var reader = new FileReader();
              reader.onload = function(e) {
                    var result = e.target.result;
                    var data = d3.csv.parseRows(result.replace(/\s*;/g, ','));
                    $scope.datacsv = data;
                  };
              reader.readAsText(file);
            }
            else{
              console.log('error: file not found');
            }

            return false;
          };

        $scope.saveData = function(){
          var isNew = angular.isDefined($scope.datasetId);
          
          if (isNew === true){
            $scope.datasetId = removeAccents($scope.datasetTitle);
          }
          var data = $scope.data;
          var titles = $scope.titles;

          if($scope.checkModel === 'json') {
            try {
                data = jQuery.parseJSON($scope.jsonDataAsText);
                titles = $scope.getFormatTitles([], data);
              }
            catch(e){
                console.log('error ' + e);
                return false;
              }
          }
          else if($scope.checkModel === 'csv') {
            data = $scope.datacsv;
            var firstrow = ($scope.hasTitles) ? data.shift() : [];
            titles = $scope.getFormatTitles(firstrow, data);
          }

          $scope.$storage.datasets[$scope.datasetId] = { 'title' : $scope.datasetTitle, 'id' : $scope.datasetId, 'data' : data, 'titles' : titles };
          $scope.data = data;
          $scope.titles = titles;

          if (isNew === true) {
            $location.path('/dataset/edit/' + $scope.datasetId);
          }
          else if($scope.data.length>0 && angular.element('#dataset_tableview').scope()){
            $scope.computeData();
            angular.element('#dataset_tableview').scope().reload();
          }
        };

        $scope.deleteData = function(){
            delete $localStorage.datasets[$scope.datasetId];
            $location.path('/');
          };

        if($scope.datasetId){
          var dataset = $scope.$storage.datasets[$scope.datasetId];
          if (typeof(dataset) !== 'undefined') {
            $scope.data = dataset.data;
            $scope.datasetTitle = dataset.title || '';
            $timeout(function(){$scope.titles = dataset.titles;}, 200);
          }
        }
      }]);

/**
function hasClass(element, classNameToTestFor) {
    var classNames = element.className.split(' ');
    for (var i = 0; i < classNames.length; i++) {
      if (classNames[i].toLowerCase() === classNameToTestFor.toLowerCase()) {
        return true;
      }
    }
    return false;
  }
**/
