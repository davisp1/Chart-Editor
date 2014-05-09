'use strict';

function normalize(strAccents) {
      var r = strAccents.toLowerCase();
      r = r.replace(new RegExp('\\s', 'g'),'');
      r = r.replace(new RegExp('[àáâãäå]', 'g'),'a');
      r = r.replace(new RegExp('æ', 'g'),'ae');
      r = r.replace(new RegExp('ç', 'g'),'c');
      r = r.replace(new RegExp('[èéêë]', 'g'),'e');
      r = r.replace(new RegExp('[ìíîï]', 'g'),'i');
      r = r.replace(new RegExp('ñ', 'g'),'n');
      r = r.replace(new RegExp('[òóôõö]', 'g'),'o');
      r = r.replace(new RegExp('œ', 'g'),'oe');
      r = r.replace(new RegExp('[ùúûü]', 'g'),'u');
      r = r.replace(new RegExp('[ýÿ]', 'g'),'y');
      r = r.replace(new RegExp('\\W', 'g'),'');
      return r;
}

angular.module('newChartEditorApp')
   .controller('DataSetEditCtrl', ['$scope', '$routeParams', '$rootScope', '$localStorage','$location', 'ngTableParams', '$filter', '$timeout',
   function($scope, $routeParams, $rootScope, $localStorage, $location, ngTableParams, $filter, $timeout) {
        
        $rootScope.currentDataset = $routeParams.datasetId;
        $scope.datasetId = $routeParams.datasetId;
        $scope.$storage = $localStorage.$default({ datasets: {} });
        $scope.data = [];
        $scope.sharedData = {
                title: '',
                datacsv: '',
                titles: ''
        };
        var inEditMode = angular.isDefined($scope.datasetId);
        /** Functions linked to the scope **/
        $scope.computeData = function(){
            $timeout(function(){
                $scope.sharedData.jsonDataAsText = JSON.stringify($scope.data,null,'\t');
                var lines = $scope.data.map(function(element){ return element.join('\t'); });
                var text = lines.join('\n');
                $scope.sharedData.dataFromCopy = text;
              }, 1000);
          };

        $scope.deleteData = function(){
            delete $localStorage.datasets[$scope.datasetId];
            $location.path('/');
          };

        $scope.onFileSelect = function($files,sharedData) {
            $scope.parseFile($files[0],sharedData);
          };

        $scope.saveData = function(){
            if (!angular.isDefined($scope.datasetId)){
              $scope.datasetId = normalize($scope.sharedData.title);
            }
            var data = $scope.data;
            var titles = $scope.sharedData.titles;

            if($scope.sharedData.source === 'json') {
              try {
                  data = JSON.parse($scope.sharedData.jsonDataAsText);
                  titles = getFormatTitles([], data);
                }
              catch(e){
                  console.log('error ' + e);
                  return false;
                }
            }
            else if($scope.sharedData.source === 'csv') {
              data = $scope.sharedData.datacsv;
              var firstrow = ($scope.sharedData.hasTitles) ? data.shift() : [];
              titles = getFormatTitles(firstrow, data);
            }

            $scope.$storage.datasets[$scope.datasetId] = { 'data' : data,
                                                           'id' : $scope.datasetId,
                                                           'title' : $scope.sharedData.title,
                                                           'titles' : titles };
            $scope.data = data;
            $scope.sharedData.titles = titles;

            if (!inEditMode) {
              $location.path('/dataset/edit/' + $scope.datasetId);
            }
            else if($scope.data.length>0){
              $scope.computeData();
              var datasetScope = angular.element('#dataset_tableview').scope();
              if (angular.isDefined(datasetScope))
              {
                datasetScope.reload();
              }
            }
        };


        /** external functions **/
        var getFormatTitles = function(currentTitles, data){
          var titles = [];

          for (var i = 0; i < data[0].length; i++) {
            var title;
            if(!angular.isDefined(currentTitles[i])){
              title = { field: 'col' + i, index: i, title: 'col' + i};
            }
            else{
              title = (angular.isDefined(currentTitles[i].title)) ? currentTitles[i] : { field: 'col' + i, index: i, title: currentTitles[i]};
            }
            titles.push(title);
          }
          return titles;
        };

        $scope.parseFile = function(file){
            if (angular.isDefined(file)) {
              var reader = new FileReader();
              reader.onload = function(e) {
                    var result = e.target.result;
                    var data = d3.csv.parseRows(result.replace(/\s*;/g, ','));
                    $scope.sharedData.datacsv = data;
                  };
              reader.readAsText(file);
            }
            else{
              console.log('error: file not found');
            }

            return false;
          };

        if($scope.datasetId){
          var dataset = angular.copy($scope.$storage.datasets[$scope.datasetId]);
          if (angular.isDefined(dataset)) {
            $scope.data = dataset.data;
            $scope.sharedData.title = dataset.title || '';
            $timeout(function(){$scope.sharedData.titles = dataset.titles;}, 200);
          }
        }
      }]);