app.controller('BonusCtrl', function ($scope, $ionicModal, $http, API_ENDPOINT) {
    //Modal cita extra (scheduleCalendar)
    $ionicModal.fromTemplateUrl('templates/scheduleCalendarAppointment.html', {
        scope: $scope,
        id: 'scheduleCalendarForm',
        animation: 'slide-in-up',
        focusFirstInput: false,
        hardwareBackButtonClose: true
    }).then(function (modal) {
        $scope.scheduleCalendarModal = modal;
    });
    $scope.openScheduleCalendarModal = function () {
        $scope.scheduleCalendar = {
            customer_employee: $scope.customersEmployeesNotAll[0],
            customer_place: $scope.customersPlacesNotAll[0],
            date: moment().hours(0).minutes(0).second(0).milliseconds(0).toDate(),
            start_time: moment().second(0).milliseconds(0).toDate(),
            end_time: null,
        };
        $scope.scheduleCalendarModal.show();
    }
    $scope.closeScheduleCalendarModal = function () {
        $scope.scheduleCalendarModal.hide();
    }
    $scope.saveScheduleCalendar = function () {
        AuthService.saveScheduleCalendar($scope.scheduleCalendar).then(function (msg) {
            $scope.closeScheduleCalendarModal();
            $ionicPopup.alert({
                title: 'Cita extra!',
                template: 'Cita extra guardada correctamente'
            });
        }, function (errMsg) {
            $ionicPopup.alert({
                title: 'Error cita extra!',
                template: errMsg
            });
        });
    };
});