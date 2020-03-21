(function () {
    'use strict';

    angular
        .module('app')
        .controller('report.controller', Controller);

    function Controller($window, UserService, FlashService,$scope,$http,$stateParams) {
        var vm = this;

        vm.user = null;
        vm.expenseitem = null;
        
        var foo = $stateParams.reportname;
        //console.log("foofoo:"+foo); 

        initController();

        function initController() {
            

            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                //console.log("user ka name:"+user.username);
                //console.log("foo:"+foo);
               UserService.GetRep(foo).then(function (expenseitem) {
                   if(expenseitem){
                        if(expenseitem=='error') {
                            //console.log("redirect bro");
                        } else {
                         vm.expenseitem = expenseitem;
                        //console.log("inside rep dash");
                        //console.log("expense item:"+ expenseitem);
                        //console.log("expenseitems1"+ expenseitems[0].empname);
                        
                }
                   }


                   
                    });
               
            })
            .catch(function (err) {
             console.log(err);
        });
           
            
        }



    }

})();