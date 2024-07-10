app.service('Main', function ($http, API_ENDPOINT) {
    var self = this;
    /*const loadPaymentMethods = $http.get(API_ENDPOINT.url + '/paymentMethods').then(function (result) {
        return result.data.paymentMethods;
    });*/
    this.actorinfo = undefined;
    this.getActorInfo = function () {
        if (!this.actorinfo) {
            $http.get(API_ENDPOINT.url + '/actorinfo').then(function (result) {
                self.actorinfo = result.data
            });

        }
    };

})  