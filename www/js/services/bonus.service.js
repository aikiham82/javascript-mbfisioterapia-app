 app.service('Bonus', function ($q, $http, $ionicModal, PaymentMethod, API_ENDPOINT) {
     var self = this;
     this.bonuses;
     this.openModal = function ($scope) {
         $ionicModal.fromTemplateUrl('templates/bonusMoneyMovementModal.html', {
             scope: $scope,
             id: 'bonusMoneyMovementForm',
             animation: 'slide-in-up',
             focusFirstInput: false,
             hardwareBackButtonClose: true
         }).then(function (modal) {
             self.modal = modal;
             self.modal.show();
         });
     }
     this.showModal = function ($scope) {
         PaymentMethod.getPaymentMethods().then(function (data) {
             $scope.paymentMethods = data;
             $scope.bonusMoneyMovement = {}
             $scope.bonusMoneyMovement.payment_method = data[0];
             self.getBonuses().then(function (data) {
                 $scope.customerBonuses = data;
                 $scope.bonusMoneyMovement.customer_bonus = data[0];
                 $scope.bonusMoneyMovement.amount = data[0].price;
                 $scope.bonusMoneyMovement.concept = data[0].name;

                 if (!self.modal) {
                     self.openModal($scope);
                 } else {
                     if ($scope.$id != self.modal.scope.$id) {
                         self.openModal($scope);
                     } else
                         self.modal.show();
                 }
             })
         })
     }
     this.closeModal = function () {
         if (self.modal) self.modal.hide();
     }
     this.getBonuses = function () {
         if (!this.bonuses) {
             this.bonuses = this.setBonuses()
         }
         return this.bonuses;
     }
     this.setBonuses = function () { //Bonos disponibles para asignar a asistentes, los bonos de cliente
         return $q(function (resolve, reject) {
             $http.get(API_ENDPOINT.url + '/customer_bonuses').then(function (result) {
                 resolve(result.data.customer_bonuses);
             });
         });
     }
 })