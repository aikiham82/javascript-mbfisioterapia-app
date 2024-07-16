app.controller('LeftMenuCtrl', function ($scope, $location, $ionicPopup, $timeout, Main, Attendee, History, MoneyMovement, Bonus, Calendar, AuthService, CustomerEmployee, CustomerPlace, CustomerActivity, Unpayment, uiCalendarConfig, $ionicSideMenuDelegate, Tpv) {
    $scope.launchAttendesPopup = function (action) {
        $scope.attendeeAction = action;
        if ($scope.attendeeAction != "bonusMoneyMovement") $scope.bonusMoneyMovement = undefined;
        Attendee.loadAttendees();
        angular.element(document.querySelector('#leftMenu_attendeesPopup')).triggerHandler('click');
        if ($scope.attendeeAction == "bonusMoneyMovement") $scope.closeBonusMoneyMovementModal();
    }
    $scope.$on('newAttendeeFired', function (event, args) {
        if (args.controller.target == "leftMenu") {
            $scope.attendee = {};
            Attendee.showModal($scope);
        }
    })
    $scope.saveAttendee = function () {
        if ($scope.attendeeAction == "saleInvoice") {
            Attendee.save($scope.attendee).then(function (result) {
                $scope.attendeeSelect(result);
            });
        } else
            Attendee.save($scope.attendee);
    }

    $scope.closeAttendeeModal = function () {
        Attendee.closeModal();
    }
    $scope.attendeeSelect = function (newValue) { //profesionales
        if ($scope.attendeeAction == "bonusMoneyMovement") {
            $scope.bonusMoneyMovement.attendee = newValue;
            Event.event = undefined; //para que no se introduzca en ningun evento el bono recien contratado
            MoneyMovement.save($scope.bonusMoneyMovement);
            $ionicPopup.alert({
                title: 'Cobrar bono',
                template: "Cobro realizado correctamente"
            });
            Calendar.loadEvents();
        } else if ($scope.attendeeAction == "saleInvoice") {
            if (newValue.attendee_id == null) {
                $scope.$broadcast('newAttendeeFired', {
                    controller: {
                        "target": "leftMenu"
                    }
                });
            } else {
                $scope.moneyMovement.attendee = newValue;
                saveSaleInvoiceCall();
            }
        } else {
            $scope.attendee = !newValue.attendee_id ? {} : newValue;
            Attendee.showModal($scope);
        }
    }


    $scope.logout = function () {
        AuthService.logout();
    };
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

    $scope.openTpvModal = function () {
        Tpv.showModal($scope);
    }
    $scope.openPayment = function () {
        $scope.tpvMovement.urlok = $location.absUrl().split('/')[0] + "/" + $location.absUrl().split('/')[1] + "/" + $location.absUrl().split('/')[2];
        Tpv.getTpvData($scope.tpvMovement).then(function (data) {
            $scope.tpvData = data;
            $timeout(function () { //Para que de tiempo a establecer los profesionales y las sucursales
                var form = angular.element(document.querySelector('#tpvForm'));
                form[0].submit();
            }, (500))

        });
    }
    $scope.closeTpvModal = function () {
        Tpv.closeModal();
    }

    $scope.openScheduleCalendarModal = function () {
        //dar cita extra
        Calendar.showModal($scope);
    }
    $scope.closeScheduleCalendarModal = function () {
        Calendar.closeModal();
    }
    $scope.saveScheduleCalendar = function () {
        Calendar.saveScheduleCalendar($scope.scheduleCalendar);
    }
    $scope.openMoneyMovementModal = function () { //Caja
        MoneyMovement.showModal($scope);
    }
    $scope.closeMoneyMovementModal = function () { //caja
        MoneyMovement.closeModal();
    }
    $scope.saveMoneyMovement = function () { //Caja
        $scope.moneyMovement.isEvent = false;
        MoneyMovement.save($scope.moneyMovement);
    }
    $scope.saveSaleInvoice = function () {
        if (!$scope.moneyMovement.attendee) {
            MoneyMovement.closeModal();
            $scope.launchAttendesPopup("saleInvoice");
        } else {
            saveSaleInvoiceCall();
        }
    };
    saveSaleInvoiceCall = function () {
        MoneyMovement.saveSaleInvoice($scope.moneyMovement, true).then(function (data) {
            window.open(data.url);
            MoneyMovement.closeModal();
        });
    }
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
        $scope.launchAttendesPopup("bonusMoneyMovement");
    };
    $scope.saveBonusSaleInvoice = function () {
        MoneyMovement.saveSaleInvoice($scope.bonusMoneyMovement, true).then(function (data) {
            window.open(data.url);
        });
    };
    //fin bonus
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
    $scope.launchUnpaymentsPopup = function (bonus) {
        Unpayment.getUnpayments();
        angular.element(document.querySelector('#leftMenu_unpaymentsPopup')).triggerHandler('click');
    }
    $scope.unpaymentSelect = function (newValue) { //profesionales
        $ionicSideMenuDelegate.toggleLeft();
        uiCalendarConfig.calendars['EventsCalendar'].fullCalendar('gotoDate', newValue.date);
    }
    $scope.changePassword = function () {
        $ionicPopup.show({
            template: 'Contraseña: <input type="password" ng-model="user.password"><br>Repite contraseña<input type="password" ng-model="user.repassword">',
            title: 'Escribe tu contraseña',
            scope: $scope,
            buttons: [{
                text: 'Cancelar'
            }, {
                text: '<b>Guardar</b>',
                type: 'button-positive',
                onTap: function (e) {
                    if (!$scope.user.password) {
                        //don't allow the user to close unless he enters wifi password
                        e.preventDefault();
                    } else if ($scope.user.password != $scope.user.repassword) {
                        $ionicPopup.alert({
                            title: 'Cambio de contraseña',
                            template: 'Las contraseñas no coinciden'
                        });
                        e.preventDefault();
                    } else {
                        AuthService.changePassword($scope.user).then(function (msg) {
                            $ionicPopup.alert({
                                title: 'Cambio de contraseña',
                                template: msg
                            });
                        }, function (errMsg) {
                            $ionicPopup.alert({
                                title: 'ERROR! Cambio de contraseña',
                                template: errMsg
                            });
                        });
                    }
                }
            }]
        });
    }
    $scope.searchCP = function (filter) { //profesionales
        const results = $scope.locations.filter(o => o.name.toLowerCase().includes(filter.toLowerCase()));
        const firstResult = results.pop();
        if (firstResult) {
            if (!Array.isArray($scope.attendee)) $scope.attendee.location = firstResult;
            else $scope.attendee[0].location = firstResult;
        }
    }
    $scope.$watch(function () {
        return Main.actorinfo;
    }, function (newVal) {
        if (newVal) {
            $scope.customer = newVal.customer;
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
        return Unpayment.unpayments;
    }, function (newVal) {
        if (newVal) {
            $scope.unpayments = newVal;
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
            $scope.customerActivities = Object.assign([], CustomerActivity.customerActivities);
            $scope.customerActivities.unshift({
                "customer_activity_id": null,
                "name": "Sin actividad"
            });
        }
    });
    $scope.user = AuthService.getAuthenticatedUser();
    $scope.paymentSearchProperties = ['attendee_name', 'dateString', 'start'];
    $scope.filterCP = "";
    $scope.attendeesSearchProperties = ['customer_attendee_id', 'name', 'cifnif', 'phone1', 'phone2'];
});