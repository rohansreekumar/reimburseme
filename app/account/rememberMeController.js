var app = angular.module("app");
 
app.controller('loginController', ["$scope", "$state", "$sanitize", "loginService", "$modal", "flashService", "$location", "sessionService", "rememberMeService", "Base64", function ($scope, $state, $sanitize, loginService, $modal, flashService, $location, sessionService, rememberMeService, Base64) {
    self = this;
        
    
    if (rememberMeService('7ZXYZ@L') && rememberMeService('UU@#90')) {
        self.user.username = Base64.decode(rememberMeService('7ZXYZ@L'));
        self.user.password = Base64.decode(rememberMeService('UU@#90'));
    }
 
  
    self.rememberMe = function () {
        if (self.remember) {
 
            rememberMeService('7ZXYZ@L', Base64.encode(self.user.username));
            rememberMeService('UU@#90', Base64.encode(self.user.password));
        } else {
            rememberMeService('7ZXYZ@L', '');
            rememberMeService('UU@#90', '');
        }
    };
}
])