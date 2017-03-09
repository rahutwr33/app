/*
Created at : 4/10/2016
*/
(function() {
    'use strict';

    aenApp.factory("baseService", ["$http", "$resource", function($http, $resource) {
       
        /*var getZipcode = function() {
            return $resource('/admin/get/zipcode/:id', null, {
                'get': { method: 'GET', id: '@id' },
            });
        }*/
        
        /*var baseOperation = function(){
            return $resource('/user',null,{
                getNotifications:{
                    method:'GET',
                    url:"/user/getNotifications/:userId/:type"
                }
            })
        }*/
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        return {
            capitalizeFirstLetter: capitalizeFirstLetter,
            // homeOperation : homeOperation,
        }
    }])
})();
     