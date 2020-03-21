(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.IndexController', Controller);

    function Controller($window, UserService, FlashService, DashboardService) {
        var vm = this;
        var usertype;
        var utype;
       // console.log("inside cont");
        vm.user = null;
        vm.saveUser = saveUser;
        vm.deleteUser = deleteUser;

        initController();

        function initController() {
           
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                usertype=vm.user.usertype;
            // console.log("user type is " + usertype);

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

        function saveUser() {
            UserService.Update(vm.user)
                .then(function () {
                    FlashService.Success('User updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deleteUser() {
            UserService.Delete(vm.user._id)
                .then(function () {
                    // log user out
                    $window.location = '/login';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }

})();