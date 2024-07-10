app.service('Event', function ($http, $ionicPopup, $rootScope, $ionicModal, $timeout, API_ENDPOINT, Main, Calendar, Attendee, CustomerActivity, ATTENDANCE, NOT_ATTENDANCE, AVAILABLE, NOT_AVAILABLE) {
    var self = this;
    this.event = undefined;
    this.comment = undefined;

    this.resetComment = function () {
        self.comment = {
            attendance_not_attendance_id: self.event.attendance_not_attendance_id,
            text: '',
            customer_employee_id: undefined
        }
    };
    this.addComment = function (comment) {
        $http.post(API_ENDPOINT.url + '/addComment', comment).then(function (result) {
            if (result.data.success) {
                if (self.event.comments == null) self.event.comments = []; //Cuando no hay comentarios es null, creo que array en ese caso
                self.event.comments.push(result.data.attendance_not_attendance_comment);
                self.resetComment();
                resolve(result.data);
            } else {
                reject(result.data.msg);
            }
        }).catch(function activateError(error) {
            reject(error.statusText);
        });
    };
    this.removeComment = function (attendance_not_attendance_comment_id, index) {
        self.comment.attendance_not_attendance_comment_id = attendance_not_attendance_comment_id;
        $http.post(API_ENDPOINT.url + '/removeComment', self.comment).then(function (result) {
            if (result.data.success) {
                self.event.comments.splice(index, 1);
                self.resetComment();
                resolve(result.data.msg);
            } else {
                reject(result.data.msg);
            }
        }).catch(function activateError(error) {
            reject(error.statusText);
        });
    }
    this.openModal = function (hideAfterShown) {
        $ionicModal.fromTemplateUrl('templates/eventModal.html', {
            id: 'eventModalForm',
            animation: 'slide-in-up',
            focusFirstInput: false,
            hardwareBackButtonClose: true
        }).then(function (modal) {
            self.modal = modal;
            self.modal.show();
            if (hideAfterShown) {
                self.modal.hide();
                $timeout(function () { //Dar tiempo a que se oculte, sino cuando lo pongo visible de nuevo se ve ocultandose
                    var eventModalFormElement = angular.element(document.querySelector('#eventModalForm'));
                    eventModalFormElement = eventModalFormElement[0];
                    eventModalFormElement.className = eventModalFormElement.className.replace(/(?:^|\s)invisible(?!\S)/g, '');
                }, (500))
            }
        });
    }
    this.showModal = function () {
        this.resetComment();
        if (!self.modal) {
            this.openModal();
        } else {
            self.modal.show();
        }
    }
    this.closeModal = function () {
        self.modal.hide();
    }
    this.eventClick = function (event) {
        this.event = event;
        if (Main.actorinfo.customer && Calendar.events.freeCounters) { //Si soy cliente y estoy en el calendario de asistencias
            this.showModal();
        } else {
            this.alertOnEventClick();
        }
    }
    this.alertOnEventClick = function () {
        if (this.event.state == NOT_ATTENDANCE || this.event.state == AVAILABLE) {
            // if (Calendar.events.freeCounters.length > 0) { //para poder recuperar una clase tiene que tener huecos disponibles, antes cogian un hueco y luego recuperaban su clase asignada. Asi tenían una mas sin pagar
            /*Cuando se muestran las actividades es muy importante saber cuales se pueden mostrar segun la fecha/hora y el profesional,
     ya que es posible que sea una actividad grupal y ya haya algun asistente para esa fecha/hora y profesional,
     por lo tanto sólo se pueda coger esa actividad.
     Para eso compruebo si hay alguna asistencia grupal para esa fecha/hora y ese profesional, en caso que asi sea
     solo muestro esa actividad.*/
            CustomerActivity.setCustomerActivitiesByEvent(this.event);
            angular.element(document.querySelector('#event_customerActivitiesPopup')).triggerHandler('click');
        } else {
            this.eventConfirmPopup();
        }
    }
    /* alert on eventClick */
    this.eventConfirmPopup = function () {
        var confirmPopup = null;
        var selectedAttendees = Attendee.selectedAttendees;
        var event = this.event;
        if (event.state == ATTENDANCE) {
            confirmPopup = $ionicPopup.confirm({
                title: event.title + (event.description != undefined ? " <b>" + event.description + "</b> " : " ") + event.start.format('dddd DD/MMM') + " a las " + event.start.format('HH:mm'),
                template: '¿Está seguro de que no podrá asistir y dejar la plaza vacante?'
            });
        } else if (event.state == NOT_ATTENDANCE || event.state == AVAILABLE) {
            if (selectedAttendees != undefined) { //Se ha seleccionado cancelar en el desplegable de asistentes
                if (selectedAttendees[0].attendee_id == null) {
                    $rootScope.$broadcast('newAttendeeFired', {
                        controller: {
                            "target": "event"
                        }
                    });
                } else { //asistente ya existente seleccionado
                    var selectedAttendeess_names = "";
                    if (Array.isArray(selectedAttendees)) {
                        for (var i = 0; i < selectedAttendees.length; i++) {
                            selectedAttendeess_names += selectedAttendees[i].name + '<br>';
                        }
                    }
                    confirmPopup = $ionicPopup.confirm({
                        title: selectedAttendeess_names + " " + event.title + (event.description != undefined ? " <b>" + event.description + "</b> " : " ") + event.start.format('dddd DD/MMM') + " a las " + event.start.format('HH:mm'),
                        template: '¿Está seguro de que desea reservar?'
                    });
                }
            } else {
                //Se trata de un rol asistente
                confirmPopup = $ionicPopup.confirm({
                    title: event.title + (event.description != undefined ? " <b>" + event.description + "</b> " : " ") + event.start.format('dddd DD/MMM') + " a las " + event.start.format('HH:mm'),
                    template: '¿Está seguro de que desea reservar?'
                });
            }
        } else if (event.state == NOT_AVAILABLE) {}
        if (confirmPopup != null) {
            confirmPopup.then(this.confirmPopupCallBack);
        }
    };
    this.confirmPopupCallBack = function (res) {
        if (res) {
            Calendar.manageAttendances(self.event, (self.event.state != ATTENDANCE ? CustomerActivity.customerActivity : null), (self.event.state != ATTENDANCE ? Attendee.selectedAttendees : null)).then(function () {
                if (self.modal) self.modal.hide(); //Cierro el modal porque ha ido bien
                if (self.event.state == ATTENDANCE) {
                    /*AuthService.attendance_notattendance(event, $scope.customer_activity, null).then(function (data) {
                        $scope.calendarEventsSource = undefined;
                        $scope.freeEventsSource = undefined;
                        $scope.reloadCalendarEvents();
                        if (data.other_attendance) {
                            //hay que dar la posibilidad de poder reservar otra clase que no este asignada
                            confirmPopup = $ionicPopup.confirm({
                                title: 'Disponibilidad',
                                template: '¿Desea ver la disponibilidad para otro día?'
                            });
                            confirmPopup.then(function (res) {
                                if (res) {
                                    $scope.calendarEventsSource = undefined;
                                    $scope.freeEventsSource = undefined;
                                    $scope.resetScopeVars();
                                    $scope.reloadFreeEvents();
                                }
                            });
                        }
                        $scope.closeEventModal(); //Cierro el modal porque ha ido bien
                        //en caso de que se haya cancelado con
                    });*/
                }
            });
        }
    }
    this.openModal(true); //para que se instancie el controllador EventCtr que es el carga la lista de actividades
})