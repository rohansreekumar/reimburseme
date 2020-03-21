(function () {
    'use strict';

    angular
        .module('app')
        .controller('employerdashboard.controller', Controller);

    function Controller($window, UserService, FlashService,DashboardService) {
        var vm = this;
        
        vm.user = null;
        var usertype;

        initController();

        function initController() {
            
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


                    UserService.GetExpenseMan(vm.user).then(function (expenseitems) {
                   if(expenseitems!=undefined && expenseitems.length>0){
                        if(expenseitems=='error') {
                            //console.log("redirect bro");
                        } else {
                         vm.expenseitems = expenseitems;
                        //console.log("inside emp dash");
                        //console.log("expense item:"+ expenseitems);
                        //console.log("expenseitems1"+ expenseitems[0].empname);
                        }
                   }


                   
                    });








            });

            


            
        }

    
    }

})();