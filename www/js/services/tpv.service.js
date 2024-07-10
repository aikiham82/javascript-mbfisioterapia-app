app.service('Tpv', function ($q, $ionicModal, $http, API_ENDPOINT) {
    var self = this;
    this.data;
    this.openModal = function ($scope) {
        $ionicModal.fromTemplateUrl('templates/tpvModal.html', {
            scope: $scope,
            id: 'tpvMovementForm',
            animation: 'slide-in-up',
            focusFirstInput: false,
            hardwareBackButtonClose: true
        }).then(function (modal) {
            self.modal = modal;
            self.modal.show();
        });
    }
    this.showModal = function ($scope) {
        $scope.tpvMovement = {};
        if (!self.modal) {
            this.openModal($scope);
        } else {
            if ($scope.$id != self.modal.scope.$id) {
                this.openModal($scope);
            } else
                self.modal.show();
        }
    }
    this.closeModal = function () {
        self.modal.hide();
    }
    this.getTpvData = function (data) {
        return this.setTpvData(data);
    }
    this.setTpvData = function (data) {
        return $q(function (resolve, reject) {
            $http.post(API_ENDPOINT.url + '/tpvData', data).then(function (result) {
                resolve(result.data.tpvData);
            });
        });
    }
})