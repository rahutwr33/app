/*
Created at : 4/10/2016
*/
(function() {
    'use strict';

    var app = angular.module('loginCtrl', []);

    app.controller('LoginController', ['$scope', 'authService', '$window', 'EncodeDecodeService', '$state', 'logger', 'UserService', '$stateParams', '$rootScope', '$location',
        function($scope, authService, $window, EncodeDecodeService, $state, logger, UserService, $stateParams, $rootScope, $location) {
            //title for login
            $rootScope.title = "Login";
            $scope.user = {};
            $scope.setPassForm = {};
            // filling the user name and the password if rememberMe is SET in localStorage
            if (Boolean($window.localStorage.uas_user_remember_me)) {
                $scope.user.rememberMe = Boolean($window.localStorage.uas_user_remember_me);
                $scope.user.email = EncodeDecodeService.Base64.decode($window.localStorage.uas_user_email);
                $scope.user.password = EncodeDecodeService.Base64.decode($window.localStorage.uas_user_password);
            }
            $scope.signIn = function(user, form) {
                if (form.$valid) {
                    $scope.disableSbmtBtn = true;
                    $scope.loader = true;
                    authService.signin().save(user, function(response) {
                        $scope.disableSbmtBtn = false;
                        $scope.loader = false;
                        if (response.status == "success") {
                            $window.localStorage.uas_user_token = response.token;
                            $state.go('effort');
                        } else {
                            logger.logError(response.message);
                        }
                        UserService.setUser(response.data);

                    });
                }
            };
            $scope.setPasswordInit = function() {
                $rootScope.title = "Set Password";
                authService.checkVerify().save({verifying_token: $stateParams.token}, function(response) {
                    if (response.status == "success") {
                      $scope.setPassData = response.data;
                    } else {
                        logger.logError(response.message);
                    }
                });

            }
            $scope.setPassword = function(form){
                if (form.$valid) {
                    $scope.setPassForm.verifying_token = $stateParams.token;
                    authService.setPassword().save($scope.setPassForm, function(response) {
                        $scope.disableSbmtBtn = false;
                        $scope.loader = false;
                        if (response.status == "success") {
                            logger.logSuccess(response.message);
                            $scope.setPassData = '';
                        } else {
                            logger.logError(response.message);
                        }
                    });
                }
            }
        }
    ]);

})();
