(function () {
    'use strict';

    angular
        .module('app')
        .controller('employeedashboard.controller', Controller);

    function Controller($window, UserService, FlashService,$scope,$http,DashboardService) {
        var vm = this;

        vm.user = null;
        vm.expenseitems = null;
        vm.redirectUser = redirectUser;
        var usertype;
       // vm.showrep = showrep;


        initController();

        function initController() {
            

            UserService.GetCurrent().then(function (user) {
                vm.user = user;

                usertype=vm.user.usertype;
                console.log("user type is " + usertype);

                if(usertype == "employer")
                {
                    DashboardService.SetTrue();

                }
                else if(usertype == "employee")
                {
                     DashboardService.SetFalse();
                }
                //console.log("user ka name:"+user.username);
                UserService.GetExpense(vm.user).then(function (expenseitems) {
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
               
            })
            .catch(function (err) {
             console.log(err);
        });
           
            
        }


        function redirectUser() {
            
                    //console.log("inside redirect");
                    $window.location = '/createnewreport';
               
                
        }
         
    }

})();