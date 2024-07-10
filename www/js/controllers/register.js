app.controller('RegisterCtrl', function ($scope, AuthService, $ionicPopup, $state) {
    $scope.user = {
        name: '',
        password: ''
    };
    $scope.signup = function () {
        AuthService.register($scope.user).then(function (msg) {
            $state.go('outside.login');
            $ionicPopup.alert({
                title: 'Register success!',
                template: msg
            });
        }, function (errMsg) {
            $ionicPopup.alert({
                title: 'Register failed!',
                template: errMsg
            });
        });
    };
})