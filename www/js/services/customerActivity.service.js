app.service('CustomerActivity', function ($http, API_ENDPOINT) {
    this.customerActivityFilter = [];
    this.freeCounters;
    this.loadCustomerActivities = function (freeCounters) {
        this.setCustomerActivities(freeCounters);
    }
    this.setCustomerActivities = function (freeCounters) {
        this.freeCounters = freeCounters;
        var customerActivities_ = [];
        freeCounters.forEach(function (freeCounter) {
            if (customerActivities_.find(function (element) {
                    return element.customer_activity_id == freeCounter.customer_activity_id;
                }) == undefined) {
                customerActivities_.push(freeCounter);
            }
        });
        customerActivities_.sort(function (a, b) {
            if (a.name > b.name) {
                return 1;
            }
            if (a.name < b.name) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });
        this.customerActivities = customerActivities_;
        (this.customerActivitiesAll = Object.assign([], this.customerActivities)).unshift({
            "customer_activity_id": null,
            "name": "TODAS"
        });
    }
    this.setCustomerActivitiesByEvent = function (event) {
        var me = this;
        $http.get(API_ENDPOINT.url + '/customersActivitiesByEvent?date=' + event.date + '&schedule_week_id=' + event.schedule_week_id + '&customer_employee_id=' + event.customer_employee_id).then(function (result) {
            me.customerActivities = result.data.customers_activities;
            if (result.data.customers_activities.length == 0) { //no hay ninguna actividad grupal
                me.setCustomersActivitiesByFilter(event);
            }
        });
    }
    this.setCustomersActivitiesByFilter = function (event) {
        var me = this;
        this.freeCounters.forEach(function (freeCounter) {
            var found = false;
            for (var i = 0; i < me.customerActivities.length; i++) {
                if (freeCounter.customer_activity_id == me.customerActivities[i].customer_activity_id) {
                    found = true;
                    break;
                }
            }
            if (!found && //que no este seleccionado o que este seleccionado o que este seleccionado TODOS
                (freeCounter.customer_place_id == event.customer_place_id || event.customer_place_id == null) &&
                (freeCounter.customer_employee_id == event.customer_employee_id || event.customer_employee_id == null)) {
                me.customerActivities.push(freeCounter);
            }
        });
    }


})