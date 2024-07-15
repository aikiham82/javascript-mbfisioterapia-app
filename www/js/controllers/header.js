app.controller('HeaderCtrl', function ($scope, Main, Calendar, CustomerEmployee, CustomerPlace, $ionicSideMenuDelegate) {
    $scope.toggleLeft = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.toggleRight = function () {
        if ($ionicSideMenuDelegate.isOpenRight()) {
            Calendar.loadEvents();
        }
        $ionicSideMenuDelegate.toggleRight();
    };
    $scope.$watch(function () {
        return Main.actorinfo;
    }, function (newVal) {
        if (newVal) {
            $scope.welcome_message = newVal.msg;
        }
    });
    $scope.$watch(function () {
        return CustomerEmployee.customerEmployee;
    }, function (newVal) {
        if (newVal) {//asistencias
            $scope.customerEmployee = newVal;
        }
    });
    $scope.$watch(function () {
        return CustomerPlace.customerPlace;
    }, function (newVal) {
        if (newVal) {//asistencias
            $scope.customerPlace = newVal;
        }
    });
    Main.getActorInfo();
});