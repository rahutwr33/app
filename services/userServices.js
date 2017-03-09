depModules.factory("UserService", ["$http", "$resource", "$rootScope", "Constants", function($http, $resource, $rootScope, Constants) {

    var user = {};
    var getUser = function() {
            return user;
        },
        setUser = function(userData) {
            user = '';
            user = userData;
        },
        logOut = function() {
            return $resource('/admin/logOut', {
                get: {
                    method: 'GET' // this method issues a PUT request
                }
            });
        }

    var getInfoMessage = function(code) {
        return Constants.infoCodes[code]
    }
    return {
        getUser: getUser,
        setUser: setUser,
        logOut: logOut,
        getInfoMessage: getInfoMessage
    }
}]);
