(function(app) {
    "use strict";
    
    app.controller("LoginController", loginController);
    
    function loginController() {
        var vm = this;
        
        vm.login = function() {
            console.log("It works!");
        };
    };
        
})(angular.module("app"));