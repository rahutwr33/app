    var aenApp = angular.module("aenApp", ['depModules']);
    aenApp.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

        //adding http intercepter
        $httpProvider.interceptors.push(function($q, $location, $window) {
            return {
                request: function(config) {
                    config.headers = config.headers || {};
                    // config.headers['Authorization'] = 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==';
                    config.headers['authorization'] = 'admin_bearer ' + $window.localStorage.uas_user_token;
                    config.headers['client-type'] = 'browser'; // this is used to detect the request is from the browser
                    return config;
                },
                response: function(response) {
                    if (response.data.message == 'Unauthorized') {
                        delete $window.localStorage.uas_user_token;
                        // handle the case where the user is not authenticated
                        $location.path('/login');
                    }
                    return response || $q.when(response);
                }
            };
        });

        $httpProvider.defaults.cache = false;
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        // disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
        $httpProvider.defaults.headers['device'] = 'asdf';
         var checkLoggedin = function($q, $timeout, $http, $location, $rootScope, $state, UserService) {
             // Initialize a new promise
             var deferred = $q.defer();

             // Make an AJAX call to check if the user is logged in
             $http.get('/admin/loggedin').success(function(response) {
                 // Authenticated
                 var user = response.user;
                 if (response.status == 'OK') {
                     // this will set the user in the session to the application model
                     UserService.setUser(user);
                     $state.go('effort');
                 }
                 // // Not Authenticated
                 else {
                     $timeout(function() {
                         deferred.resolve();
                     }, 0);
                 }
             }).error(function(error) {
                 $timeout(function() {
                     deferred.resolve();
                 }, 0);
             });
             return deferred.promise;
         };

         var checkLoggedout = function() {
            return ['$q', '$timeout', '$http', '$location', '$rootScope', '$state', 'UserService',
                function ($q, $timeout, $http, $location, $rootScope, $state, UserService) {
            // Initialize a new promise

            var deferred = $q.defer();
            // Make an AJAX call to check if the user is logged in
            $http.get('/admin/loggedin').success(function(response) {
                // Authenticated
                if (response.status == 'OK') {
                    var user = response.user;
                    UserService.setUser(user);
                    // $state.go('effort');
                    $timeout(deferred.resolve, 0);
                }
                // Not Authenticated
                else {
                    $timeout(function() {
                        deferred.resolve();
                    }, 0);
                    $state.go('login');
                }
            }).error(function(error) {
                $timeout(function() {
                    deferred.resolve();
                }, 0);
                $state.go('login');
            });
            return deferred.promise;
        }];
    };

        $urlRouterProvider.otherwise('/login');
        $stateProvider
        // // HOME STATES AND NESTED VIEWS ========================================
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('login', {
            url: '/login',
            views: {
                'content': {
                    templateUrl: '/admin/modules/auth/views/login.html',
                    controller: "LoginController"
                }
            },
            data: {
                isAuthenticate: false
            },
            resolve: {
                loggedin: checkLoggedin,
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        '/admin/modules/auth/controllers/loginController.js',
                        '/admin/modules/auth/services/authService.js'
                    ]);
                }
            }
        })
        .state('effort', {
            url: '/effort',
            views: {
                'header': {
                    templateUrl: '/admin/modules/common/views/header.html',
                },
                'content': {
                    templateUrl: '/admin/modules/effort/views/calender.html',
                    controller: "EffortController"
                },
                'footer': {
                     templateUrl: '/admin/modules/common/views/footer.html',
                }
            },
            data: {
                isAuthenticate: false
            },
            resolve: {
                loggedin: checkLoggedout(),
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                      '/bower_components/ng-table/dist/ng-table.min.css',
                      '/bower_components/ng-table/dist/ng-table.min.js',
                        '/admin/modules/effort/controllers/effortController.js',
                        '/admin/modules/effort/services/effortService.js',
                        '/bower_components/angular-ui-calendar/src/calendar.js',
                        '/bower_components/fullcalendar/dist/fullcalendar.min.js',
                        '/bower_components/fullcalendar/dist/gcal.js'
                    ]);
                }
            }
        })
        .state('effort-detail', {
            url: '/effort/effort-detail',
            views: {
                'header': {
                    templateUrl: '/admin/modules/common/views/header.html',
                },
                'content': {
                    templateUrl: '/admin/modules/effort/views/addEffort.html',
                    controller: "EffortDetailController"
                },
                'footer': {
                     templateUrl: '/admin/modules/common/views/footer.html',
                }
            },
            params :{
              effortDetails : null
            },
            data: {
                isAuthenticate: false
            },
            resolve: {
                loggedin: checkLoggedout(),
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                      '/bower_components/ng-table/dist/ng-table.min.css',
                      '/bower_components/ng-table/dist/ng-table.min.js',
                        '/admin/modules/effort/controllers/effort-detailController.js',
                        '/admin/modules/effort/services/effortService.js',
                        '/assets/js/jquery-ui.js'
                    ]);
                }
            }
        })
        .state('effortList', {
            url: '/effort/effort-list',
            views: {
                'header': {
                    templateUrl: '/admin/modules/common/views/header.html',
                },
                'content': {
                    templateUrl: '/admin/modules/effort/views/ListEffort.html',
                    controller: "EffortController"
                },
                'footer': {
                     templateUrl: '/admin/modules/common/views/footer.html',
                }
            },
            params :{
              effortDetails : null
            },
            data: {
                isAuthenticate: false
            },
            resolve: {
                loggedin: checkLoggedout(),
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        '/bower_components/ng-table/dist/ng-table.min.css',
                        '/bower_components/ng-table/dist/ng-table.min.js',
                        '/admin/modules/effort/controllers/effortController.js',
                        '/admin/modules/effort/services/effortService.js',
                        '/bower_components/angular-ui-calendar/src/calendar.js',
                        '/bower_components/fullcalendar/dist/fullcalendar.min.js',
                        '/bower_components/fullcalendar/dist/gcal.js'

                    ]);
                }
            }
        })
        .state('survey', {
            url: '/survey',
            views: {
                'header': {
                    templateUrl: '/admin/modules/common/views/header.html',
                },
                'content': {
                    templateUrl: '/admin/modules/survey/views/survey.html',
                    controller: "SurveyListController"
                },
                'footer': {
                    templateUrl: '/admin/modules/common/views/footer.html',
                }
            },
            data: {
                isAuthenticate: false
            },
            resolve: {
                loggedin: checkLoggedout(),
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        '/bower_components/ng-table/dist/ng-table.min.css',
                        '/bower_components/ng-table/dist/ng-table.min.js',
                        '/admin/modules/survey/controllers/surveyListController.js',
                        '/admin/modules/survey/services/surveyService.js'
                    ]);
                }
            }
        })
         .state('createSurvey', {
            url: '/create-survey',
            views: {
                'header': {
                    templateUrl: '/admin/modules/common/views/header.html',
                },
                'content': {
                    templateUrl: '/admin/modules/survey/views/createSurvey.html',
                    controller: "SurveyController"
                },
                'footer': {
                    templateUrl: '/admin/modules/common/views/footer.html',
                }
            },
            data: {
                isAuthenticate: false
            },
            resolve: {
                loggedin: checkLoggedout(),
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        '/admin/modules/survey/controllers/surveyController.js',
                        '/admin/modules/survey/services/surveyService.js'
                    ]);
                }
            }
        })
        .state('createNewQuestion', {
            url: '/create-new-question/:surveyId',
            views: {
                'header': {
                    templateUrl: '/admin/modules/common/views/header.html',
                },
                'content': {
                    templateUrl: '/admin/modules/survey/views/createNewQuestion.html',
                    controller: "SurveyController"
                },
                'footer': {
                    templateUrl: '/admin/modules/common/views/footer.html',
                }
            },
            data: {
                isAuthenticate: false
            },
            resolve: {
                loggedin: checkLoggedout(),
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        '/admin/modules/survey/controllers/surveyController.js',
                        '/admin/modules/survey/services/surveyService.js',
                        '/assets/js/jquery-ui.js'
                    ]);
                }
            }
        })
        .state('previewQuestions', {
            url: '/preview-question/:surveyId',
            views: {
                'header': {
                    templateUrl: '/admin/modules/common/views/header.html',
                },
                'content': {
                    templateUrl: '/admin/modules/survey/views/previewQuestion.html',
                    controller: "SurveyController"
                },
                'footer': {
                    templateUrl: '/admin/modules/common/views/footer.html',
                }
            },
            data: {
                isAuthenticate: false
            },
            resolve: {
                loggedin: checkLoggedout(),
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        '/admin/modules/survey/controllers/surveyController.js',
                        '/admin/modules/survey/services/surveyService.js'
                    ]);
                }
            }
        })
        .state('worker', {
            url: '/worker',
            views: {
                'header': {
                    templateUrl: '/admin/modules/common/views/header.html',
                },
                'content': {
                    templateUrl: '/admin/modules/worker/views/workerlist.html',
                    controller: "WorkerController"
                },
                'footer': {
                    templateUrl: '/admin/modules/common/views/footer.html',
                }
            },
            data: {
                isAuthenticate: false
            },
            resolve: {
                loggedin: checkLoggedout(),
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        '/bower_components/ng-table/dist/ng-table.min.css',
                        '/bower_components/ng-table/dist/ng-table.min.js',
                        '/admin/modules/worker/controllers/workerController.js',
                        '/admin/modules/worker/services/workerService.js'
                    ]);
                }
            }
        })
        .state('report', {
            url: '/report',
            views: {
                'header': {
                    templateUrl: '/admin/modules/common/views/header.html',
                },
                'content': {
                    templateUrl: '/admin/modules/reports/views/reportManagement.html',
                    controller: "ReportController"
                },
                'footer': {
                    templateUrl: '/admin/modules/common/views/footer.html',
                }
            },
            data: {
                isAuthenticate: false
            },
            resolve: {
                loggedin: checkLoggedout(),
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                      '/admin/modules/reports/controllers/reportController.js',
                      '/admin/modules/reports/services/reportService.js'

                    ]);
                }
            }
        })
        .state('completed', {
            url: '/completedSurvey',
            views: {
                'header': {
                    templateUrl: '/admin/modules/common/views/header.html',
                },
                'content': {
                    templateUrl: '/admin/modules/reports/views/completed.html',
                    controller: "ChartController"
                },
                'footer': {
                    templateUrl: '/admin/modules/common/views/footer.html',
                }
            },
            data: {
                isAuthenticate: false
            },
            resolve: {
                loggedin: checkLoggedout(),
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                      '/bower_components/ng-table/dist/ng-table.min.css',
                      '/bower_components/ng-table/dist/ng-table.min.js',
                      '/admin/modules/reports/controllers/chartController.js',
                      '/admin/modules/reports/services/reportService.js'

                    ]);
                }
            }
        })
        .state('quest-per', {
            url: '/byQuestionforPerson',
            views: {
                'header': {
                    templateUrl: '/admin/modules/common/views/header.html',
                },
                'content': {
                    templateUrl: '/admin/modules/reports/views/reportManagement.html',
                    controller: "ReportController"
                },
                'footer': {
                    templateUrl: '/admin/modules/common/views/footer.html',
                }
            },
            data: {
                isAuthenticate: false
            },
            resolve: {
                loggedin: checkLoggedout(),
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                      '/bower_components/ng-table/dist/ng-table.min.css',
                      '/bower_components/ng-table/dist/ng-table.min.js',
                      '/admin/modules/reports/controllers/reportController.js',
                      '/admin/modules/reports/services/reportService.js'

                    ]);
                }
            }
        })
        .state('surworker', {
            url: '/surveybyWorker',
            views: {
                'header': {
                    templateUrl: '/admin/modules/common/views/header.html',
                },
                'content': {
                    templateUrl: '/admin/modules/reports/views/surveyReportManagment.html',
                    controller: "surveyWorkerController"
                },
                'footer': {
                    templateUrl: '/admin/modules/common/views/footer.html',
                }
            },
            data: {
                isAuthenticate: false
            },
            resolve: {
                loggedin: checkLoggedout(),
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                      '/bower_components/ng-table/dist/ng-table.min.css',
                      '/bower_components/ng-table/dist/ng-table.min.js',
                      '/admin/modules/reports/controllers/survworController.js',
                      '/admin/modules/reports/services/reportService.js'

                    ]);
                }
            }
        })
        .state('answersreport', {
            url: '/answer-report',
            views: {
                'header': {
                    templateUrl: '/admin/modules/common/views/header.html',
                },
                'content': {
                    templateUrl: '/admin/modules/reports/views/answer-report.html',
                    controller: "answersReportController"
                },
                'footer': {
                    templateUrl: '/admin/modules/common/views/footer.html',
                }
            },
            data: {
                isAuthenticate: false
            },
            resolve: {
                loggedin: checkLoggedout(),
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                      '/bower_components/ng-table/dist/ng-table.min.css',
                      '/bower_components/ng-table/dist/ng-table.min.js',
                      '/admin/modules/reports/controllers/answerReportController.js',
                      '/admin/modules/reports/services/reportService.js',
                      '/admin/modules/survey/services/surveyService.js'

                    ]);
                }
            }
        })

        .state('feedback', {
            url: '/feedback',
            views: {
                'header': {
                    templateUrl: '/admin/modules/common/views/header.html',
                },
                'content': {
                    templateUrl: '/admin/modules/feedback/views/feedback.html',
                    controller: "feedbackController"
                },
                'footer': {
                    templateUrl: '/admin/modules/common/views/footer.html',
                }
            },
            data: {
                isAuthenticate: false
            },
            resolve: {
                loggedin: checkLoggedout(),
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                      '/bower_components/ng-table/dist/ng-table.min.css',
                      '/bower_components/ng-table/dist/ng-table.min.js',
                      '/admin/modules/feedback/controllers/feedbackController.js',
                      '/admin/modules/worker/services/workerService.js'

                    ]);
                }
            }
        })
        .state('setPassword', {
            url: '/set-password/:token',
            views: {
                'content': {
                    templateUrl: '/admin/modules/auth/views/setPassword.html',
                    controller: "LoginController"
                }
            },
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        '/admin/modules/auth/controllers/loginController.js',
                        '/admin/modules/auth/services/authService.js'
                    ]);
                }
            }
        });
    });
    aenApp.run(['$rootScope', '$state', '$http', '$location', '$timeout', '$window', 'logger', 'ngTableParamsService',
        function($rootScope, $state, $http, $location, $timeout, $window, logger, ngTableParamsService) {
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
                if (fromState.name != 'worker') {
                    ngTableParamsService.set('','', '', '','');
                }
                if (toState.data) {
                    if (!$window.localStorage.uas_user_token && toState.data.isAuthenticate) {
                        event.preventDefault();
                        $state.go('login');
                    }
                }
            });
        }
    ]);
