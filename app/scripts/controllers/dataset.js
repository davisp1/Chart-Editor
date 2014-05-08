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
              title = { field: 'col' + i, index: i, title: 'col' + i};
            }
            else{
              title = (!angular.isDefined(currentTitles[i].title)) ? currentTitles[i] : { field: 'col' + i, index: i, title: currentTitles[i]};
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
          var isNew = !angular.isDefined($scope.datasetId);
          if (isNew === true){
            $scope.datasetId = normalize($scope.datasetTitle);
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

          $scope.$storage.datasets[$scope.datasetId] = { 'data' : data,
                                                         'id' : $scope.datasetId,
                                                         'title' : $scope.datasetTitle,
                                                         'titles' : titles };
          $scope.data = data;
          $scope.titles = titles;

          if (isNew === true) {
            $location.path('/dataset/edit/' + $scope.datasetId);
          }
          else if($scope.data.length>0){
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