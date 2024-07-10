app.controller('OkCtrl', function ($ionicPopup, $state) {
    console.log();
    var alertPopup = $ionicPopup.alert({
        title: $state.current.name == "ok" ? 'Tpv' : "ERROR!",
        template: $state.current.name == "ok" ? "El pago fue realizado con éxito" : "No se pudo realizar el pago. Inténtelo de nuevo"
    });
    alertPopup.then(function (res) {
        $state.go('inside');
    });
});