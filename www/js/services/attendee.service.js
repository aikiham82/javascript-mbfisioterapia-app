app.service('Attendee', function ($q, $ionicModal, $http, Main, Province, Location, History, API_ENDPOINT) {
    var self = this;
    this.selectedAttendees = undefined;
    this.attendees = undefined;
    this.openModal = function ($scope) {
        $ionicModal.fromTemplateUrl('templates/attendeeForm.html', {
            scope: $scope,
            id: 'attendeeForm',
            animation: 'slide-in-up',
            focusFirstInput: false,
            hardwareBackButtonClose: true
        }).then(function (modal) {
            self.modal = modal;
            self.modal.show();
        });
    }
    this.showModal = function ($scope) {
        $scope.attendee.province = $scope.attendee.province || Main.actorinfo.province;
        $scope.attendee.location = $scope.attendee.location || Main.actorinfo.location;
        $scope.attendee.email_notification = $scope.attendee.email_notification || true; //Por defecto a true para mb, esto habría que ponerlo en la configuracion
        Province.getProvinces().then(function (data) {
            $scope.provinces = data;
        })
        Location.getLocations($scope.attendee.province.province_id).then(function (data) {
            $scope.locations = data;
        })
        History.loadReports().then(function (data) {
            $scope.reports = data;
            $scope.report = {};
            $scope.report.selectedReport = data[0];

        });
        self.loadExtradata().then(function (data) {

            $scope.customersAttendeesExtradata = data;

        });
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
    this.setSelected = function (attendees) {
        if (!Array.isArray(attendees)) {
            this.selectedAttendees = [];
            this.selectedAttendees.push(attendees);
        } else {
            this.selectedAttendees = attendees;
        }
    }
    this.loadAttendees = function () {
        return $q(function (resolve, reject) {
            if (!self.attendees) {

                self.setAttendees().then(function (result) {
                    result.unshift({
                        "attendee_id": null,
                        "name": "NUEVO ASISTENTE"
                    });
                    self.attendees = result;
                    resolve(result);
                });

            } else {
                resolve(self.attendees);
            }
        });
    }
    this.setAttendees = function () {
        var deferred = $q.defer();
        $http.get(API_ENDPOINT.url + '/attendees').then(function (result) {
            deferred.resolve(result.data.attendees);
        }, function (error) {
            deferred.reject(error);
        });
        return $q.when(deferred.promise);
    }

    this.findAttendeeIndex = function (attendee_id) {
        if (i = self.attendees.findIndex(function (element) {
            return element.attendee_id == attendee_id;
        })) {
            return i;
        }
    }

    this.save = function (attendee) {
        return $q(function (resolve) {
            const newAttendee = attendee.attendee_id ? false : true;
            $http.post(API_ENDPOINT.url + '/saveAttendee', attendee).then(function (result) {
                attendee = result.data.msg;
                //Lo guardo en el array de asistentes para no tener que volver a cargarlos en caso de ser un asistente nuevo
                if (newAttendee) self.attendees.push(attendee);
                else {
                    self.attendees[self.findAttendeeIndex(attendee.attendee_id)] = attendee;
                }
                self.closeModal();
                resolve(result.data.msg);
            });
        });
    };

    //DATOS EXTRA ITEMS
    this.loadExtradata = function () {
        return $q(function (resolve) {
            $http.get(API_ENDPOINT.url + '/customersAttendeesExtradata').then(function (result) {
                resolve(result.data.customersAttendeesExtradata);
            });
        });
    }

    //HISTORIAL
    this.openHistoryModal = function ($scope) {
        $ionicModal.fromTemplateUrl('templates/historyModal.html', {
            scope: $scope,
            id: 'historyForm',
            animation: 'slide-in-up',
            focusFirstInput: false,
            hardwareBackButtonClose: true
        }).then(function (modal) {
            self.modalHistory = modal;
            self.modalHistory.show();
        });
    }
    this.showHistoryModal = function ($scope) {
        self.loadAttendeesAttendances($scope);
        if (!self.modalHistory) {
            this.openHistoryModal($scope);
        } else {
            if ($scope.$id != self.modalHistory.scope.$id) {
                this.openHistoryModal($scope);
            } else
                self.modalHistory.show();
        }
    }
    this.closeHistoryModal = function () {
        self.modalHistory.hide();
    }
    this.loadAttendeesAttendances = function ($scope) {
        if (!$scope.attendeeAttendances) {
            $scope.attendeeAttendances = {
                paginationPageSizes: [5, 10, 20],
                paginationPageSize: 5,
                enableHorizontalScrollbar: true,
                columnDefs: [{
                    field: 'sesión'
                }, {
                    field: 'pago'
                }, {
                    field: 'actividad'
                }, {
                    field: 'profesional'
                }, {
                    field: 'pagado'
                }, {
                    field: 'bono'
                }, {
                    field: 'motivo',
                    cellTooltip: function (row, col) {
                        return row.entity.motivo;
                    }
                }]
            }
        }
        this.setAttendeeAttendances($scope).then(function (result) {
            $scope.attendeeAttendances.data = result.sort((a, b) => {
                const parseDateTime = (str) => {
                    const [day, month, year, hour, minute] = str.match(/\d+/g);
                    return new Date(`20${year}-${month}-${day}T${hour}:${minute}`);
                };
                const dateA = parseDateTime(a.sesión);
                const dateB = parseDateTime(b.sesión);
                return dateB - dateA;  // For descending order
            });
        });
    }
    this.setAttendeeAttendances = function ($scope) {
        var deferred = $q.defer();
        $http.get(API_ENDPOINT.url + '/attendeeAttendances?attendee_id=' + $scope.attendee.attendee_id).then(function (result) {
            deferred.resolve(result.data.attendances);
        }, function (error) {
            deferred.reject(error);
        });
        return $q.when(deferred.promise);
    };
    //FIN HISTORIAL
})