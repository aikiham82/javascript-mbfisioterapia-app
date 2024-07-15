app.service('Calendar', function ($http, $q, $ionicModal, CustomerActivity, CustomerEmployee, CustomerPlace, API_ENDPOINT, uiCalendarConfig) {
    const self = this;
    this.events = undefined; //eventos actuales renderizados
    this.multipleSelect = false; //selección multiple activa
    this.selectedEvents = []; //eventos seleccionados cuando la selección multiple está activa
    this.from = undefined;
    this.free = false;
    this.openModal = function ($scope) {
        $ionicModal.fromTemplateUrl('templates/scheduleCalendarAppointment.html', {
            scope: $scope,
            id: 'scheduleCalendarForm',
            animation: 'slide-in-up',
            focusFirstInput: false,
            hardwareBackButtonClose: true
        }).then(function (modal) {
            self.modal = modal;
            self.modal.show();
        });
    }
    this.showModal = function ($scope) {
        $scope.customerEmployeesNotAll = CustomerEmployee.customerEmployeesNotAll;
        $scope.customerPlacesNotAll = CustomerPlace.customerPlacesNotAll;
        $scope.scheduleCalendar = {
            customer_employee: CustomerEmployee.customerEmployeesNotAll[0],
            customer_place: CustomerPlace.customerPlacesNotAll[0],
            date: moment().hours(0).minutes(0).second(0).milliseconds(0).toDate(),
            start_time: moment().second(0).milliseconds(0).toDate(),
            end_time: null
        };
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
    this.saveScheduleCalendar = function (scheduleCalendar) {
        return $q(function (resolve) {
            $http.post(API_ENDPOINT.url + '/saveScheduleCalendar', scheduleCalendar).then(function (result) {
                self.closeModal();
                resolve(result.data.msg);
                self.freeEventsSource = undefined; //para que se recarguen del servidor los huecos, eventos libres.
            });
        });
    }
    this.setEvents = function (free, from, to) {
        this.from = from;
        const apiMethod = !free ? "events" : "free_events";
        $http.get(API_ENDPOINT.url + "/" + apiMethod + '?attendee_id=null&customer_place_id=null&customer_activity_id=null' +
            `&customer_employee_id=null&grouped=true&from=${from}&to=${to}`).then(function (result) {
            self.events = result.data;
            if (!free) self.attendancesEventsSource = self.events;
            else self.freeEventsSource = self.events;
            self.filterEvents(self.events);
        });

    };
    this.loadEvents = function (free) {
        const view = uiCalendarConfig.calendars['EventsCalendar'].fullCalendar('getView');
        const from = view.start.format('YYYY-MM-DD');
        const to = view.end.format('YYYY-MM-DD');
        if (free === undefined) {
            if (self.free !== undefined) {
                free = self.free
            } else free = false;
        }
        self.free = free;
        this.setEvents(free, from, to);
        this.selectedEvents = [];
    };
    this.filterEvents = function (eventsSource) { //filtro local
        var customerEmployeesFilter = CustomerEmployee.customerEmployeeFilter;
        var customerPlaceFilter = CustomerPlace.customerPlaceFilter;
        var customerActivityFilter = CustomerActivity.customerActivityFilter;
        if (customerPlaceFilter.length > 0 || customerEmployeesFilter.length > 0 || customerActivityFilter.length > 0) {
            var filterEventsSource = angular.copy(eventsSource);
            filterEventsSource.events.events = [];
            for (var i = 0; i < eventsSource.events.events.length; i++) {
                var hit = true;
                if (customerEmployeesFilter.length > 0 && !customerEmployeesFilter.includes(eventsSource.events.events[i].customer_employee_id)) {
                    hit = false;
                }
                if (customerPlaceFilter.length > 0 && !customerPlaceFilter.includes(eventsSource.events.events[i].customer_place_id)) {
                    hit = false;
                }
                if (customerActivityFilter.length > 0 && !customerActivityFilter.includes(eventsSource.events.events[i].customer_activity_id)) {
                    hit = false;
                }
                if (hit) {
                    filterEventsSource.events.events.push(eventsSource.events.events[i]);
                }
            }
            self.events = filterEventsSource;
        } else {
            self.events = eventsSource;
        }
    }
    this.manageAttendances = function (event, customer_activity, attendees) {
        //es posible que haya más de un evento seleccionado
        var events = [];
        var events_ = [];
        if (this.selectedEvents.length == 0) {
            events.push(event);
        } else {
            events = this.selectedEvents;
        }
        var multiple = attendees != null;
        if (!multiple) {
            attendees = [];
            if (this.selectedEvents.length == 0) {
                attendees.push({
                    attendee_id: event.attendee_id,
                    name: event.attendee_name,
                    email: event.attendee_email,
                    email_notification: event.email_notification
                });
            } else {
                attendees.push({
                    attendee_id: undefined,
                    name: undefined,
                    email: undefined,
                    email_notification: undefined
                });
            }
        }
        for (var i = 0; i < attendees.length; i++) {
            for (var j = 0; j < events.length; j++) {
                event = events[j];
                var event_ = {
                    schedule_week_id: event.schedule_week_id,
                    schedule_calendar_id: event.schedule_calendar_id,
                    date: event.date,
                    start: event.start,
                    end: event.end,
                    title: (event.title != " " ? event.title : customer_activity.name),
                    attendee_id: (attendees[i].attendee_id ? attendees[i].attendee_id : event.attendee_id),
                    attendee_name: (attendees[i].name ? attendees[i].name : event.attendee_name),
                    attendee_email: (attendees[i].email ? attendees[i].email : event.attendee_email),
                    attendee_email_notification: (attendees[i].email_notification ? attendees[i].email_notification : event.attendee_email_notification),
                    attendance_not_attendance_id: event.attendance_not_attendance_id,
                    state: event.state,
                    customer_employee_id: event.customer_employee_id,
                    customer_employee_name: event.customer_employee_name,
                    customer_place_id: event.customer_place_id,
                    customer_place_name: event.customer_place_name,
                    customer_activity_id: (customer_activity ? customer_activity.customer_activity_id : event.customer_activity_id),
                    customer_activity_name: (customer_activity ? customer_activity.name : event.customer_activity_name)
                }
                events_.push(event_);
            }
        }
        return $http.post(API_ENDPOINT.url + '/attendance_notattendance', events_).then(function (result) {
            if (result.data.success) self.loadEvents(false);
        });
    }
    this.setMultipleSelection = function (multipleSelect) {
        this.multipleSelect = multipleSelect;
    }
    this.findEventIndex = function (array, event) {
        if (i = array.findIndex(function (element) {
            return element._id == event._id;
        })) {
            return i;
        }
    }
    this.findEventsByAttendee = function (array, attendee_id) {
        let events = [];
        array.forEach(function (element) {
            element.events.forEach(function (event) {
                if (event.attendee_id == attendee_id) events.push(event);
            });

        });
        return events;
    }
    /*this.updateAttendancesEventsSource = function (event) {
        var index = this.attendancesEventsSource.events.events.indexOf($filter('filter')(this.attendancesEventsSource.events.events, {
            'date': event.date,
            'attendee_id': event.attendee_id,
            'start': event.start._i,
            'customer_employee_id': event.customer_employee_id
        })[0]);
        this.attendancesEventsSource.events[index] = event;
    }*/
})