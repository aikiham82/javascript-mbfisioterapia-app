app.controller('ButtonsCtrl', function ($scope, Calendar, Main, CustomerNote) {
    $scope.openCustomerNotesModal = function () { //son notas semanales
        CustomerNote.showModal();
    }
    $scope.loadEvents = function (free) {
        Calendar.loadEvents(free);
    }
    $scope.$watch(function () {
        return Calendar.events;
    }, function (newVal) {
        if (newVal) { //asistencias
            if (newVal.freeCounters) {
                $scope.freeCounters = newVal.freeCounters;
                $scope.attendanceEvents = true;
            } else {
                $scope.attendanceEvents = false;
            }
        }
    });
    $scope.$watch(function () {
        return Main.actorinfo;
    }, function (newVal) {
        if (newVal) {
            $scope.customer = newVal.customer;
        }
    });
    $scope.$watch(function () {
        return $scope.multipleSelection;
    }, function (newVal) {
        if (newVal != undefined) {
            Calendar.setMultipleSelection(newVal);
        }
    });
});