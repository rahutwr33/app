/*
 Created at : 04/10/2016
 */
aenApp.controller("BaseController", ["$scope", "$state", "$stateParams", "logger","$http", "$window", "$location", "$rootScope", "baseService","UserService",
    function ($scope, $state, $stateParams, logger,$http, $window, $location, $rootScope, baseService ,UserService) {
        // title
        $rootScope.title = "AEN Admin";

          $scope.logout = function() {
            delete $window.localStorage.uas_user_token;
            $state.go('login');

          }

    }
]);
