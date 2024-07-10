app.controller('LoginCtrl', function ($scope, $window, AuthService, $ionicPopup, $state, $ionicPopup, AUTH_EVENTS) {
    $scope.user = {
        name: '',
        password: '',
        remember: ''
    };
    $scope.login = function () {
        AuthService.login($scope.user).then(function (msg) {
            if (msg.length > 0) {
                $ionicPopup.alert({
                    title: 'Mensaje',
                    template: msg
                });
            }
            $state.go('inside');
        }, function (errMsg) {});
    };

    $scope.keyPressed = function (keyEvent) {
        if (keyEvent.which === 13)
            $scope.login();
    }

    $scope.$on(AUTH_EVENTS.notAuthenticated, function (event) {
        AuthService.logout();
        $ionicPopup.alert({
            title: 'Sesión finalizada!',
            template: 'Lo siento, Tienes que iniciar sesión de nuevo.'
        });
    });
    $scope.user.remember = JSON.parse(window.localStorage.getItem("remember"));
    if ($scope.user.remember) {
        $scope.user.name = window.localStorage.getItem("username");
        $scope.user.password = window.localStorage.getItem("password");
    }
});