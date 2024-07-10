app.service('CustomerNote', function ($q, $http, $ionicModal, uiCalendarConfig, API_ENDPOINT) {
    var self = this;
    this.customerNote = undefined;

    this.openModal = function () {
        $ionicModal.fromTemplateUrl('templates/customerNotes.html', {
            id: 'customerNoteForm',
            animation: 'slide-in-up',
            focusFirstInput: false,
            hardwareBackButtonClose: true,
        }).then(function (modal) {
            self.modal = modal;
            self.modal.show();
            console
        });
    }
    this.showModal = function () {
        this.reset();
        this.loadCustomerNote(uiCalendarConfig.calendars['EventsCalendar'].fullCalendar('getView'));
        if (!this.modal) {
            this.openModal();
        } else {
            this.modal.show();
        }
    }
    this.closeModal = function () {
        this.modal.hide();
    }
    this.loadCustomerNote = function (view) {
        if (!this.customerNote) this.reset();
        const fromdate = view.start.format('YYYY-MM-DD');
        const todate = view.end.format('YYYY-MM-DD');
        if (this.customerNote.fromdate !== fromdate) {
            this.setCustomerNote(fromdate).then(function (result) {
                if (result.customerNotes.length > 0) {
                    self.customerNote = result.customerNotes[0];
                    self.customerNote.fromdate = moment(self.customerNote.fromdate).format('YYYY-MM-DD');
                } else {
                    self.reset(fromdate, todate);
                }
            });
        }
    }
    this.setCustomerNote = function (fromdate) {
        return $q(function (resolve) {
            $http.get(API_ENDPOINT.url + '/customerNotes?date=' +
                      fromdate).then(function (result) {
                resolve(result.data);
            });
        });

    }
    this.save = function (customerNote) {
        customerNote.reminderDateFormatted = moment(customerNote.reminderDate).format()
        this.customerNote = customerNote;
        return $q(function (resolve) {
            $http.post(API_ENDPOINT.url + '/saveCustomerNote', customerNote).then(function (result) {
                resolve(result.data);
            });
        });
    }
    this.reset = function (fromdate, todate) {
        this.customerNote = {
            customer_note_id: null,
            text: '',
            fromdate: fromdate ? fromdate : moment().startOf("week").format('YYYY-MM-DD'),
            todate: todate ? todate : moment().endOf("week").format('YYYY-MM-DD'),
            reminderDate: null
        }
    }
    this.signIn = function () {
        gapi.auth2.getAuthInstance().signIn();
    }
});