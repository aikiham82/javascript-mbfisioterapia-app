 app.service('MoneyMovement', function ($q, $http, $ionicModal, Event, PaymentMethod, Calendar, API_ENDPOINT) {
     var self = this;
     this.openModal = function ($scope) {
         $ionicModal.fromTemplateUrl('templates/moneyMovementModal.html', {
             scope: $scope,
             id: 'moneyMovementForm',
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
             if ($scope.event) {
                 $scope.moneyMovement = {
                     money_movement_id: $scope.event.money_movement_id,
                     amount: $scope.event.money_movement_id == null ? $scope.event.price : $scope.event.amount, //Si el evento ya tiene asociado un pago pongo el importe del pago sino el precio del producto de la actividad asociada
                     customer_activity: {
                         customer_activity_id: $scope.event.customer_activity_id,
                         name: $scope.event.title
                     },
                     customer_place: {
                         customer_place_id: $scope.event.customer_place_id,
                         customer_place_name: $scope.event.customer_place_name
                     },
                     customer_employee: {
                         customer_employee_id: $scope.event.customer_employee_id,
                         customer_employee_name: $scope.event.customer_employee_name
                     },
                     attendee: {
                         attendee_id: $scope.event.attendee_id,
                         attendee_name: $scope.event.attendee_name,
                     },
                     payment_method: $scope.event.money_movement_id == null ? $scope.paymentMethods[0] : $scope.paymentMethods[$scope.event.payment_method_id - 1],
                     concept: $scope.event.description + ' ' + $scope.event.title + ' ' + $scope.event.start.format('dddd DD/MMM') + ' a las ' + $scope.event.start.format('HH:mm'),
                     attendance_not_attendance_id: $scope.event.attendance_not_attendance_id
                 }
                 /* Estos son los bonos disponibles, en caso de que no se haya pagado todavía la asistencia.
                 Si tiene bonos el importe es 0, siempre se paga con el bono si hay bonos
                 */
                 if ($scope.event.money_movement_id == null && $scope.event.bonuses != null) {
                     $scope.moneyMovement.amount = 0;
                     $scope.moneyMovement.attendee_customer_bonus = {
                         attendee_customer_bonus_id: $scope.event.bonuses[0].attendee_customer_bonus_id,
                         name: $scope.event.bonuses[0].name
                     };
                     $scope.moneyMovement.payment_method = $scope.paymentMethods[4];
                     //esta asistencia se pago con un bono
                 } else if ($scope.event.money_movement_id != null && $scope.event.attendee_customer_bonus_id != null) {
                     $scope.moneyMovement.attendee_customer_bonus = {
                         attendee_customer_bonus_id: $scope.event.attendee_customer_bonus_id,
                         name: $scope.event.customer_bonus_name
                     };
                 }
                 //La opcíon de pago bono se queda desactivada en caso que no haya bonos para pagar o usa, así se evitan errores.
                 if ($scope.event.bonuses == null) {
                     $scope.paymentMethods[4].disabled = true;
                 } else {
                     $scope.paymentMethods[4].disabled = false;
                 }
             } else {
                 $scope.moneyMovement = {
                     customer_activity: $scope.customerActivities[0],
                     customer_place: $scope.customerPlacesNotAll[0],
                     customer_employee: $scope.customerEmployeesNotAll[0],
                     payment_method: $scope.paymentMethods[0]
                 }
             }
             $scope.moneyMovement.date = moment().hours(0).minutes(0).second(0).milliseconds(0).toDate();
             $scope.moneyMovement.time = moment().second(0).milliseconds(0).toDate();
             if (!self.modal) {
                 self.openModal($scope);
             } else {
                 if ($scope.$id != self.modal.scope.$id) {
                     self.openModal($scope);
                 } else
                     self.modal.show();
             }
         })
     }
     this.closeModal = function () {
         self.modal.hide();
     }
     this.save = function (moneyMovement) {
         return $q(function (resolve, reject) {
             $http.post(API_ENDPOINT.url + '/saveMoneyMovement', moneyMovement).then(function (result) {
                 if (moneyMovement.isEvent) { // se comprueba si es un movimiento puntual o relacionado con un evento
                     Event.event.money_movement_id = result.data.money_movement_id;
                     Event.event.amount = moneyMovement.amount;
                     Event.event.payment_method_id = moneyMovement.payment_method.payment_method_id;
                     //Para incrementar el uso del bono si se usa para pagar
                     if (moneyMovement.attendee_customer_bonus != undefined) {
                         let attendeeEvents = Calendar.findEventsByAttendee(Calendar.events.events.events, Event.event.attendee_id);
                         attendeeEvents.forEach(function (event) {
                             event.attendee_customer_bonus_id = moneyMovement.attendee_customer_bonus.attendee_customer_bonus_id;
                             event.customer_bonus_name = moneyMovement.attendee_customer_bonus.name;
                             const index = event.bonuses.findIndex(function (element) {
                                 if (element.attendee_customer_bonus_id == moneyMovement.attendee_customer_bonus.attendee_customer_bonus_id) {
                                     return true;
                                 }
                             });
                             if (index != -1) {
                                 event.bonuses[index].usage++;
                                 if (event.bonuses[index].usage == event.bonuses[index].value)
                                     event.bonuses = null; //Asumimos que sólo tiene uno, si tiene más hay que cambiar la programacíon
                             }
                         });
                     }
                     //Se ha contratado un bono, se añade a lista de bonos del evento para ser asigando, siepre que estemos en la ventana de cobro
                     if (Event.event.attendee_schedule_week_id) {
                         Calendar.loadServerEvents(); //Los cargo todos de nuevo para no tener que cambiar el punto en todos
                     } else {
                         //cambio el punto
                         var eventElement = document.getElementById("dot" + Event.event._id);
                         if (eventElement) {
                             eventElement.style.display = "none";
                         }
                     }
                     if (result.data.attendee_customer_bonus_id != undefined) {
                         if (!Array.isArray(Event.event.bonuses)) {
                             Event.event.bonuses = [];
                         }
                         Event.event.bonuses.push({
                             "attendee_customer_bonus_id": result.data.attendee_customer_bonus_id,
                             "customer_activity_id": moneyMovement.customer_bonus.customer_activity_id,
                             "customer_bonus_id": moneyMovement.customer_bonus.customer_bonus_id,
                             "expiration_datetime": moneyMovement.customer_bonus.expiration_datetime,
                             "name": moneyMovement.customer_bonus.name,
                             "usage": null,
                             "value": moneyMovement.customer_bonus.value
                         });
                     }
                 }
                 moneyMovement.money_movement_id = result.data.money_movement_id;
                 if (moneyMovement.payment_method.payment_method_id == 2) { //tarjeta
                     self.saveSaleInvoice(moneyMovement, false);
                 }
                 resolve(result.data);
             });
         });
     }
     this.saveSaleInvoice = function (moneyMovement, pdf) {
         moneyMovement.pdf = pdf;
         return $q(function (resolve, reject) {
             $http.post(API_ENDPOINT.url + '/saveSaleInvoice', moneyMovement).then(function (result) {
                 if (result.data.success) {
                     resolve(result.data);
                 }
             });
         });
     }
     this.findBonusIndex = function (array, bonus) {
         if (i = array.findIndex(function (element) {
                 return element.attendee_customer_bonus_id == bonus.attendee_customer_bonus_id;
             })) {
             return i;
         }
     }
 })