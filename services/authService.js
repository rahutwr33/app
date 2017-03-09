/*
Created at : 4/10/2016
*/
(function() {
    'use strict';
    var app = angular.module('authServiceFactory', []);
    app.factory("authService", ["$http", "$resource", function($http, $resource) {
        var signin = function() {
            return $resource('/admin/signin', null, {
                save: {
                    method: 'POST' // this method issues a PUT request
                }
            });
        }
        var setPassword = function() {
            return $resource('/worker/setPassword', null, {
                save: {
                    method: 'POST' // this method issues a PUT request
                }
            });
        }

        var checkVerify = function() {
            return $resource('/worker/verificationLinkCheck', null, {
                save: {
                    method: 'POST' // this method issues a PUT request
                }
            });
        }


        return {
            signin: signin,
            setPassword: setPassword,
            checkVerify:checkVerify
        }
    }])
})();
