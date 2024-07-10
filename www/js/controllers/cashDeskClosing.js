app.controller('CashDeskCtrl', function ($scope, $ionicModal, CashDesk) {
    //Modal para el cierre de caja
    $ionicModal.fromTemplateUrl('templates/cashDeskModal.html', {
        scope: $scope,
        id: 'cashDeskForm',
        animation: 'slide-in-up',
        focusFirstInput: false,
        hardwareBackButtonClose: true,
        controller: 'CashDeskCtrl'
    }).then(function (modal) {
        $scope.cashDeskModal = modal;
    });
    $scope.openCashDeskModal = function (noEvent) {
        $scope.cashDeskModal.show();
    }
    $scope.getCashDesk = function () {
        CashDesk.loadCashDesk($scope.cashDesk.customer_place);
    }
    $scope.closeCashDeskModal = function () {
        $scope.cashDeskModal.hide();
    }
    $scope.saveCashDesk = function () {
        CashDesk.saveCashDesk($scope.customerNote).then(function (msg) {
            $scope.closeCashDeskModal(); //cierro ventana cierre de caja
            $ionicPopup.alert({
                title: 'Cierre Caja!',
                template: 'Caja cerrada correctamente'
            });

        });
    };
    $scope.$watch(function () {
        return CashDesk.cashDesk;
    }, function (newVal) {
        $scope.$scope.cashDesk = newVal;
    });
});