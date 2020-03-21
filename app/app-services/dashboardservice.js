(function () {
    'use strict';

    angular
        .module('app')
        .factory('DashboardService', Service);

    function Service($rootScope) {
        var service = {};
        service.SetTrue = SetTrue;
        service.SetFalse = SetFalse;

        return service;

        function SetTrue () {
            $rootScope.utype = true;
        }

        function SetFalse() {
            $rootScope.utype = false;
        }
    }

})();