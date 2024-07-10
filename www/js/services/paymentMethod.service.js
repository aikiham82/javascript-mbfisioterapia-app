app.service('PaymentMethod', function ($q, $http, API_ENDPOINT) {
    var self = this;
    this.paymentMethods;
    this.getPaymentMethods = function () {
        if (!this.paymentMethods) {
            this.paymentMethods = this.setPaymentMethods()
        }
        return this.paymentMethods;
    }
    this.setPaymentMethods = function () {
        return $q(function (resolve, reject) {
            $http.get(API_ENDPOINT.url + '/paymentMethods').then(function (result) {
                resolve(result.data.paymentMethods);
            });
        });
    }

})