app.controller('EventCtrl', function ($scope, Event, Main, $ionicPopup, CustomerEmployee, CustomerPlace, Bonus, CustomerActivity, Attendee, History, MoneyMovement, NOT_ATTENDANCE, AVAILABLE) {
    launchAttendesPopup = function () {
        Attendee.loadAttendees();
        var attendeesPopup_el = angular.element(document.querySelector('#event_attendeesPopup'))
        attendeesPopup_el.triggerHandler('unCheckOptions'); //deselecciono todos los checkboxes
        attendeesPopup_el.triggerHandler('click');
    }
    $scope.$on('newAttendeeFired', function (event, args) {
        if (args.controller.target == "event") {
            $scope.attendee = {};
            Attendee.showModal($scope);
        }
    })
    $scope.attendeeSelect = function (newValue) { //profesionales
        Attendee.setSelected(newValue);
        Event.eventConfirmPopup();
    }
    $scope.saveAttendee = function () {
        Attendee.save($scope.attendee).then(function (result) {
            //si el evento es un hueco disponible
            if (Event.event.state == NOT_ATTENDANCE || Event.event.state == AVAILABLE) {
                $scope.attendeeSelect(result);
            }
        });
    }
    $scope.closeAttendeeModal = function () {
        Attendee.closeModal();
    }
    $scope.openMoneyMovementModal = function () {
        MoneyMovement.showModal($scope);
    }
    $scope.openHistoryModal = function () {
        Attendee.showHistoryModal($scope);
    }
    $scope.closeHistoryModal = function () {
        Attendee.closeHistoryModal();
    }
    $scope.onFileSelect = function ($file) {
        History.upload($scope, $file);
    }
    $scope.openReport = function () {
        History.loadReport($scope).then(function (data) {
            if (data[0])
                window.open(data[0].url);
            else
                $ionicPopup.alert({
                    title: 'Informes',
                    template: "No hay informe"
                });
        });
    }
    $scope.getExtradataKey = function (customer_attendee_extradata_id) {
        const index = $scope.attendee.extradata.findIndex(function (element) {
            if (element.customer_attendee_extradata_id == customer_attendee_extradata_id) {
                return true;
            }
        });
        if (index == -1) {
            $scope.attendee.extradata.push({
                customer_attendee_extradata_id: customer_attendee_extradata_id
            });
            return $scope.attendee.extradata.length - 1;
        }
        return index;
    }

    $scope.addComment = function (customerEmployee) {
        $scope.comment.customer_employee_id = customerEmployee.customer_employee_id;
        Event.addComment($scope.comment);
    }
    $scope.removeComment = function (attendance_not_attendance_comment_id, index) {
        Event.removeComment(attendance_not_attendance_comment_id, index);
    }
    $scope.launchCustomersEmployeesPopup = function () {
        angular.element(document.querySelector('#event_customerEmployeesPopup')).triggerHandler('click');
    }
    $scope.customerActivitySelect = function (newValue) { //profesionales
        CustomerActivity.customerActivity = newValue;
        //si es cliente o profesional
        if (Main.actorinfo.customer || Main.actorinfo.customer_employee) {
            //Se ha seleccionado volver a dar un cita en ese hueco que se ha cancelado
            launchAttendesPopup();
        } else {
            Event.eventConfirmPopup();
        }
    }
    $scope.closeEventModal = function () {
        Event.modal.hide();
    }
    $scope.alertOnEventClick = function () {
        Event.alertOnEventClick();
    }
    $scope.openAttendeeModal = function () {
        Attendee.loadAttendees().then(function (result) {
            $scope.attendee = Attendee.attendees[Attendee.findAttendeeIndex($scope.event.attendee_id)];
            Attendee.showModal($scope);
        });
    }

    $scope.closeMoneyMovementModal = function () {
        MoneyMovement.closeModal();
    }
    $scope.saveMoneyMovement = function () {
        $scope.moneyMovement.isEvent = true;
        MoneyMovement.save($scope.moneyMovement);
        MoneyMovement.closeModal();
    }
    $scope.saveSaleInvoice = function () {
        MoneyMovement.saveSaleInvoice($scope.moneyMovement, true).then(function (data) {
            window.open(data.url);
            MoneyMovement.closeModal();
            Event.closeModal();

        });
    };
    //bonus
    $scope.openBonusMoneyMovementModal = function () { //
        Bonus.showModal($scope);
    }
    $scope.closeBonusMoneyMovementModal = function () {
        Bonus.closeModal();
    }
    $scope.setBonusPrice = function () {
        for (var i = 0; i < $scope.customerBonuses.length; i++) {
            if ($scope.bonusMoneyMovement.customer_bonus.customer_bonus_id == $scope.customerBonuses[i].customer_bonus_id) {
                $scope.bonusMoneyMovement.amount = $scope.customerBonuses[i].price;
                $scope.bonusMoneyMovement.concept = $scope.customerBonuses[i].name;
                break;
            }
        }
    };
    $scope.saveBonusMoneyMovement = function () { //Cobrar bono
        var bonusAttendee = {
            attendee_id: $scope.event.attendee_id
        }
        $scope.bonusMoneyMovement.attendee = bonusAttendee;
        $scope.bonusMoneyMovement.isEvent = true;
        MoneyMovement.save($scope.bonusMoneyMovement).then(function (result) {
            $ionicPopup.alert({
                title: 'Cobrar bono',
                template: "Cobro realizado correctamente"
            });
            $scope.closeBonusMoneyMovementModal();
            //Establezco como forma de pago el bono que acabo de contratar
            $scope.moneyMovement.amount = 0;
            $scope.moneyMovement.attendee_customer_bonus = {
                attendee_customer_bonus_id: Event.event.bonuses[0].attendee_customer_bonus_id,
                name: Event.event.bonuses[0].name
            };
            $scope.moneyMovement.payment_method = $scope.paymentMethods[4];
            $scope.paymentMethods[4].disabled = false;
        });

    };
    $scope.saveBonusSaleInvoice = function () {
        /*MoneyMovement.saveSaleInvoice($scope.bonusmoneyMovement, true).then(function (data) {
            window.open(data.url);
        });*/
    };
    $scope.searchCP = function (filter) { //profesionales
        const results = $scope.locations.filter(o => o.name.toLowerCase().includes(filter.toLowerCase()));
        const firstResult = results.pop();
        if (firstResult) {
            if (!Array.isArray($scope.attendee)) $scope.attendee.location = firstResult;
            else $scope.attendee[0].location = firstResult;
        }
    }
    //fin bo nus
    $scope.$watch(function () {
        return Event.comment
    }, function (newVal) {
        if (newVal) {
            $scope.comment = newVal;
        }
    });
    $scope.$watch(function () {
        return Event.event;
    }, function (newVal) {
        if (newVal) {
            $scope.event = newVal;
        }
    });
    $scope.$watch(function () {
        return Attendee.attendees;
    }, function (newVal) {
        if (newVal) {
            $scope.attendees = newVal;
        }
    });
    $scope.$watch(function () {
        return CustomerEmployee.customerEmployees
    }, function (newVal) {
        if (newVal) {
            $scope.customerEmployees = CustomerEmployee.customerEmployees;
            $scope.customerEmployeesNotAll = CustomerEmployee.customerEmployeesNotAll;
        }
    });
    $scope.$watch(function () {
        return CustomerPlace.customerPlaces;
    }, function (newVal) {
        if (newVal) { //asistencias
            $scope.customerPlaces = newVal;
            $scope.customerPlacesNotAll = CustomerPlace.customerPlacesNotAll;
        }
    });
    $scope.$watch(function () {
        return CustomerActivity.customerActivities;
    }, function (newVal) {
        if (newVal) {
            $scope.customerActivities = CustomerActivity.customerActivities;
        }
    });
    $scope.attendeesSearchProperties = ['customer_attendee_id', 'name', 'cifnif', 'phone1', 'phone2'];
});