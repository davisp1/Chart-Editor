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
   .controller('DataSetEditCtrl', ['$scope', '$routeParams', '$rootScope', '$upload', '$localStorage','$location', 'ngTableParams', '$filter', '$compile',
   function($scope, $routeParams, $rootScope, $upload, $localStorage, $location, ngTableParams, $filter, $compile) {
        $rootScope.currentDataset = $routeParams.datasetId;
        $scope.datasetId = $routeParams.datasetId;
        $scope.$storage = $localStorage.$default({ datasets: {} });
        $scope.data = [];
        $scope.datasetTitle = "";

        $scope.computeData = function(){
            $scope.jsonDataAsText = JSON.stringify($scope.data,null,'\t');
            var lines = $scope.data.map(function(element){ return element.join('\t'); });
            var text = lines.join('\n');
            $scope.dataFromCopy = text;
          };

        if($scope.datasetId){
          var dataset = $scope.$storage.datasets[$scope.datasetId];
          if (typeof(dataset) !== 'undefined') {
            $scope.data = dataset.data;
            $scope.datasetTitle = dataset.title || '';
            $scope.computeData();
          }
        }

        $scope.onFileSelect = function($files) {
            //$files: an array of files selected, each file has name, size, and type.
            $scope.parseFile($files[0]);
          };
        

        $scope.parseFile =function(file){

            if (typeof file !== 'undefined') {
              var reader = new FileReader();
              reader.onload = function(e) {
                    var result = e.target.result;
                    var data = d3.csv.parseRows(result.replace(/\s*;/g, ','));
                    $scope.data = data;
                    $scope.computeData();
                  };
              reader.readAsText(file);
            }
            else{
              alert('error');
            }
            return false;
          };

        $scope.saveData = function(){
          var isNew = (typeof($scope.datasetId) === 'undefined');
          if (isNew === true) {
            $scope.datasetId = removeAccents($scope.datasetTitle);
          }

          $scope.$storage.datasets[$scope.datasetId] = { 'title' : $scope.datasetTitle, 'id' : $scope.datasetId, 'data' : $scope.data, 'titles' : [] };

          if (isNew === true) {
            $location.path('/chart/edit/' + $scope.datasetId);
          }
        };

        $scope.deleteData = function(){
            delete $localStorage.datasets[$scope.datasetId];
            $location.path('/');
          };
      }]);


function hasClass(element, classNameToTestFor) {
    var classNames = element.className.split(' ');
    for (var i = 0; i < classNames.length; i++) {
      if (classNames[i].toLowerCase() === classNameToTestFor.toLowerCase()) {
        return true;
      }
    }
    return false;
  }