/*
Created at : 4/10/2016
*/
(function() {
  'use strict';

  var app = angular.module('feedbackCtrl', []);
  app.controller('feedbackController', ['$scope', '$rootScope', 'logger', '$window', '$state', '$stateParams', 'workerService', 'ngTableParams',
    function($scope, $rootScope, logger, $window, $state, $stateParams, workerService, ngTableParams) {

      $scope.searching = function(searchTextField) {
          $scope.tableParams = new ngTableParams({
              page: 1,
              count: 5,
              searchText: searchTextField,

          }, {
            counts : [],
              getData: function($defer, params) {
                  // send an ajax request to your server. in my case MyResource is a $resource.
                  $scope.paramUrl = params.url();
                  workerService.getFeedback().get($scope.paramUrl, function(response) {
                      $scope.feedbackList = response.data;
                      var data = response.data;
                      $scope.totalLength = response.totalLength;
                      params.total(response.totalLength);
                      $defer.resolve(data);
                  });
              }
          });
      };

      $scope.getFeedback = function(page, count) {
          $scope.tableParams = new ngTableParams({ page: page, count: count }, {
              counts: [],
              getData: function($defer, params) {
                  // send an ajax request to your server. in my case MyResource is a $resource.
                  $scope.paramUrl = params.url();
                  workerService.getFeedback().get($scope.paramUrl, function(response) {
                      // $scope.paramUrlActive = paramUrl;
                      $scope.feedbackList = response.data;
                      $scope.feedbackData = response.totalLength;
                      var data = response.data;
                      $scope.totalLength = response.totalLength;
                      params.total(response.totalLength);
                      $defer.resolve(data);
                  });
              }
          });
      }


    }
  ]);
})();
