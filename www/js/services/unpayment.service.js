app.service('Unpayment', function ($q, $filter, $http, API_ENDPOINT) {
    var self = this;
    this.unpayments;
    this.getUnpayments = function () {
        self.setUnpayments().then(function (result) {
            self.unpayments = result.map(function (unpayment) {
                unpayment.dateString = $filter('date')(unpayment.date, "fullDate");
                return unpayment;
            });
        });
    }
    this.setUnpayments = function () {
        var deferred = $q.defer();
        $http.get(API_ENDPOINT.url + '/unpayments').then(function (result) {
            deferred.resolve(result.data.unpayments);
        }, function (error) {
            deferred.reject(error);
        });
        return $q.when(deferred.promise);
    }
})