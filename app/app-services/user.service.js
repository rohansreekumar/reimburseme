(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetCurrent = GetCurrent;
        service.GetExpense = GetExpense;
        service.GetRep = GetRep;
        service.GetExpenseMan = GetExpenseMan;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.PutVerdict = PutVerdict;

        return service;
        var v;

        function GetCurrent() {
            return $http.get('/api/users/current').then(handleSuccess, handleError);
        }

        function PutVerdict(expense,ver, comment) {
           /* console.log("inside user service of app-service verdict:"+ver);
            console.log("inside user service of app-service expense:"+expense);
            var set = {
                verdict : ver,
                exp : expense
            };
            v= JSON.stringify(set);
            console.log("v:"+v);
            console.log(typeof(v));*/
            
            return $http.get('/api/users/verdict', { params: { verdict: ver , exp : expense , comment: comment}}).then(handleSuccess, handleError);
        }

         function GetExpense(user){
            //console.log("inside user serive of app-service username:"+user.username);

             return $http.get('/api/users/currentexp').then(handleSuccess, handleError);

        }
        function GetExpenseMan(user){
            //console.log("inside user serive of app-service username:"+user.username);
 
             return $http.get('/api/users/currentexpman').then(handleSuccess, handleError);

        }
        function GetRep(expname){
            //console.log("inside user service of app-service username:"+expname);
            //console.log("typeof expname:"+ typeof(expname));
             return $http.get('/api/users/' + expname).then(handleSuccess, handleError);

        }

        function GetAll() {
            return $http.get('/api/users').then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/api/users/' + _id).then(handleSuccess, handleError);
        }

        function GetByUsername(username) {
            return $http.get('/api/users/' + username).then(handleSuccess, handleError);
        }

        function Create(user) {
            return $http.post('/api/users', user).then(handleSuccess, handleError);
        }

        function Update(user) {
            return $http.put('/api/users/' + user._id, user).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/users/' + _id).then(handleSuccess, handleError);
        }


        

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
