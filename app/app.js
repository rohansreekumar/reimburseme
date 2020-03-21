(function () {
    'use strict';

    angular
        .module('app', ['ui.router'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/employeedashboard");

        $stateProvider
            
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'account' }
            })
            .state('employeedashboard', {
                url: '/employeedashboard',
                templateUrl: 'employeedashboard/employeedashboard.html',
                controller: 'employeedashboard.controller',
                controllerAs: 'vm',
                data: { activeTab: 'employeedashboard' }

            })
            .state('home', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'Home.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'home' }
            })
            .state('report', {
                url: '/report',
                templateUrl: 'employeedashboard/report.html',
                controller: 'report.controller',
                controllerAs: 'vm',
                data: { activeTab: 'employeedashboard' },
                params: { reportname: null, verdict: null}
            })
            .state('reportmanager', {
                url: '/reportmanager',
                templateUrl: 'employerdashboard/reportmanager.html',
                controller: 'reportmanager.controller',
                controllerAs: 'vm',
                data: { activeTab: 'employerdashboard' },
                params: { reportname: null}
            })
            .state('employerdashboard', {
                url: '/employerdashboard',
                templateUrl: 'employerdashboard/employerdashboard.html',
                controller: 'employerdashboard.controller',
                controllerAs: 'vm',
                data: { activeTab: 'employerdashboard' }
            });
    }

    function run($http, $rootScope, $window) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;

            angular.bootstrap(document, ['app']);
        });
    });
})();