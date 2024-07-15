app.controller('CalendarCtrl', async function ($scope, $timeout, EventList, Main, Calendar, CustomerEmployee, CustomerPlace, CustomerActivity, uiCalendarConfig, $ionicPopup, Event, ATTENDANCE, ionicDatePicker) {

    eventAfterRender = function (event) {
        //if ($scope.customer) $scope.resetCustomerNote();
        const checkboxElement = document.getElementById(event._id);
        checkboxElement.addEventListener('change', (event) => {
            const selectedEvent = uiCalendarConfig.calendars['EventsCalendar'].fullCalendar('clientEvents', event.target.id)[0];
            if (event.target.checked) {
                Calendar.selectedEvents.push(selectedEvent);
            } else {
                var index = Calendar.findEventIndex(Calendar.selectedEvents, selectedEvent);
                Calendar.selectedEvents.splice(index, 1); //no funcina siemre devuelve el index -1
            }
        });
    };
    eventRender = function (event, element) {
        $(element).on({
            click: function () {
                if (!Calendar.multipleSelect) eventClick(event);
            },
            dblclick: function () {
                if (Calendar.multipleSelect) eventClick(event);
            }
        });
        if (Calendar.events.freeCounters) {
            element.find('.fc-title').before('<input type="checkbox" id="' + event._id + '" style="display:' + (Calendar.multipleSelect ? 'inline' : 'none') + ';">');
            const htmlEl = element.find('.fc-time').html();
            let unpayed = false;
            if (Main.actorinfo.customer) {
                for (var i = 0; i < event.events.length; i++) {
                    if (unpayed = !event.events[i].money_movement_id && event.events[i].state == ATTENDANCE && !event.events[i].attendee_free) break;
                }

                if (event.events.length == 1) {
                    element.find('.fc-title').before('<b>' + event.events[0].attendee_name + "</b>");
                }
                element.find('.fc-time').html('<span class="dot" id="dot' + event._id + '" style="display:' + (unpayed ? 'inline-block' : 'none') + '"></span>' + htmlEl + '<b><p style="float:right;padding:2px;">' + (event.busy_places != 0 ? event.busy_places + "/" + event.max_places : "") + '</p></b>');
            }
        } else {
            element.find('.fc-title').append('<input type="checkbox" id="' + event._id + '" style="display:' + (Calendar.multipleSelect ? 'inline' : 'none') + ';">');
            element.find('.fc-title').append(' <b>' + event.customer_employee_name + (CustomerPlace.customerPlacesNotAll.length > 1 ? " " + event.customer_place_name : "") + "</b>");
        }
    };
    renderCalendar = function (eventsSource) {
        if (eventsSource.events.length == 0 && $scope.attendee) {
            $ionicPopup.alert({
                title: 'Información',
                template: 'Lo siento. No hay eventos disponibles'
            });
        } else {
            //event = null;
            uiCalendarConfig.calendars['EventsCalendar'].fullCalendar('removeEvents');
            uiCalendarConfig.calendars['EventsCalendar'].fullCalendar('removeEventSource', eventsSource);
            uiCalendarConfig.calendars['EventsCalendar'].fullCalendar('addEventSource', eventsSource);
        }
    }
    eventClick = function (singleGroupedEvent) {
        if (Calendar.events.freeCounters && Main.actorinfo.customer) {
            for (var i = 0; i < singleGroupedEvent.events.length; i++) {
                Object.assign(singleGroupedEvent.events[i], singleGroupedEvent);
            }
            if (singleGroupedEvent.events.length > 1) {
                EventList.setGroupedEvent(singleGroupedEvent);
                angular.element(document.querySelector('#calendar_EventsListPopup')).triggerHandler('click');
            } else {
                var event = singleGroupedEvent.events[0];
                Event.eventClick(event);
            }
        } else {
            Event.eventClick(singleGroupedEvent);
        }
    }
    showCheckboxes = function (show) {
        Calendar.selectedEvents = [];
        if (uiCalendarConfig.calendars['EventsCalendar']) { //Puede que todavía no se haya instanciando el objeto calendar
            const viewEvents = uiCalendarConfig.calendars['EventsCalendar'].fullCalendar('clientEvents'); //Los eventos ya instanciados
            for (var i = 0; i < viewEvents.length; i++) {
                var eventElement = document.getElementById(viewEvents[i]._id);
                if (eventElement) {
                    eventElement.style.display = show ? "inline" : "none";
                }
            }
        }
    }

    viewRender = function () {
        setTimeout(() => {
            Calendar.loadEvents()
        }, 0);
    }


    /********************************************************************************/
    $scope.removeFilters = function (reload) {
        $scope.customer_place = null;
        $scope.customer_employee = null;
        if (reload) {
            if (Calendar.events.freeCounters) {
                $scope.reloadCalendarEvents();
            } else {
                $scope.reloadFreeEvents();
            }
        }
    };
    $scope.eventSelect = function (event) {
        Event.eventClick(event);
    };
    $scope.$watch(function () {
        return Calendar.events;
    }, function (newVal) {
        if (newVal) {
            $scope.freeCounters = newVal.freeCounters;
            if (newVal.freeCounters) {
                CustomerEmployee.loadCustomerEmployees(newVal.freeCounters);
                CustomerActivity.loadCustomerActivities(newVal.freeCounters);
                CustomerPlace.loadCustomerPlaces(newVal.freeCounters);
            }
            $timeout(function () { //Para que de tiempo a establecer los profesionales y las sucursales
                renderCalendar(newVal.events);
            }, (500))
        }
    });
    $scope.$watch(function () {
        return Calendar.multipleSelect;
    }, function (newVal) {
        showCheckboxes(newVal);
    });
    $scope.$watch(function () {
        return EventList.events
    }, function (newVal) {
        if (newVal) {
            $scope.events = newVal;
        }
    });
    $scope.selectDate = new Date();
    /* config calendar object */
    $scope.uiConfig = {
        calendar: {
            defaultView: 'agendaWeek',
            //editable: true,
            lang: 'es',
            minTime: "07:00:00",
            maxTime: "22:00:00",
            columnFormat: "ddd D",
            allDaySlot: false,
            axisFormat: 'HH:mm',
            hiddenDays: [0, 6],
            height: 'parent',
            contentHeight: 'auto',
            header: {
                left: 'title',
                center: 'showEvents showFree',
                right: 'refresh,datepicker,agendaDay,agendaWeek,today,prev,next'
            },
            customButtons: {
                datepicker: {
                    icon: 'calendar',
                    click: function () {
                        var configPicker = {
                            callback: function (val) {
                                $scope.selectDate = new Date(val);
                                uiCalendarConfig.calendars['EventsCalendar'].fullCalendar('gotoDate', $scope.selectDate);
                            },
                            inputDate: $scope.selectDate,
                            titleLabel: 'Selecciona fecha',
                            weeksList: ["D", "L", "M", "X", "J", "V", "S"],
                            monthsList: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                            templateType: 'popup',
                            dateFormat: 'dd MMMM yyyy',
                            closeOnSelect: true,
                            disableWeekdays: [0, 6]
                        };
                        ionicDatePicker.openDatePicker(configPicker);
                    }
                },
                refresh: {
                    icon: 'sync',
                    click: function () {
                        Calendar.loadServerEvents()
                    }
                }
            },
            views: {
                agendaThreeDay: {
                    type: 'agenda',
                    duration: {
                        days: 3
                    },
                    buttonText: '3 días'
                },
                agendaTwoDay: {
                    type: 'agenda',
                    duration: {
                        days: 2
                    },
                    buttonText: '2 días'
                },
            },
            eventRender: eventRender,
            eventAfterRender: eventAfterRender,
            viewRender: viewRender
        }
    }

});