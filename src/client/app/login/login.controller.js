(function(){
    angular.module('app.login').controller('LoginCtrl', LoginCtrl);
    //TODO: AauthService
    LoginCtrl.$inject = ['$q', 'logger', 'authService', '$http', 'API', '$state'];

    function LoginCtrl($q, logger, authService, $http, API, $state){

        var vm = this;

        vm.loginData = {
            login: '',
            password: '',
            voip: 'netsapiens'
        };

        vm.isError = false;

        vm.errorMessage = '';

        vm.login = function(){
            authService.authenticate(vm.loginData)
                .then(function(){
                    vm.isError = false;
                })
                .catch(function(err){
                    vm.isError = true;
                    vm.errorMessage = err;
                });
        };
    }
})();