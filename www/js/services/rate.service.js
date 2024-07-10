app.service('Rate', function ($q, $http, API_ENDPOINT) {
    var self = this;
    this.rates;
    this.getRates = function () {
        if (!this.rates) {
            this.rates = this.setRates()
        }
        return this.rates;
    }
    this.setRates = function () {
        return $q(function (resolve, reject) {
            $http.get(API_ENDPOINT.url + '/rates').then(function (result) {
                resolve(result.data.rates);
            });
        });
    }
})