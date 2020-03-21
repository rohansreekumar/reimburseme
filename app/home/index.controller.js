(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(UserService, DashboardService) {
        var vm = this;
        var usertype,utype;
        vm.url = url('../images/bg1.jpg');
        vm.user = null;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                usertype=vm.user.usertype;
             //console.log("user type is " + usertype);

                if(usertype == "employer")
                {
                    DashboardService.SetTrue();
                }
                else if(usertype == "employee")
                {
                     DashboardService.SetFalse();
                }
            });
        }
    }

})();