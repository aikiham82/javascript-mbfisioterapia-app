app.service('CustomerPlace', function () {
    this.customerPlaceFilter = [];
    this.loadCustomerPlaces = function (freeCounters) {
        this.setCustomerPlaces(freeCounters);
    }
    this.setCustomerPlaces = function (freeCounters) {
        var customerPlaces_ = [{
            "customer_place_id": null,
            "customer_place_name": "TODOS"
        }];
        freeCounters.forEach(function (freeCounter) {
            if (customerPlaces_.find(function (element) {
                    return element.customer_place_id == freeCounter.customer_place_id;
                }) == undefined) {
                customerPlaces_.push(freeCounter);
            }
        });
        this.customerPlaces = customerPlaces_;
        (this.customerPlacesNotAll = Object.assign([], this.customerPlaces)).shift();
    }
})