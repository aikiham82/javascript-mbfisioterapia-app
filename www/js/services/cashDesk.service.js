app.service('CashDesk', function ($http, $q, API_ENDPOINT) {
    var self = this;
    this.cashDesk = {
        amount: 0,
    };;
    this.loadCashDesk = function (customer_place) {
        this.setCashDesk(customer_place).then(function (result) {
            this.cashDeskClosing.totalCash = result.data.cashDeskClosing[0] != undefined ? result.data.cashDeskClosing[0]["sum"] : 0;
            this.cashDeskClosing.totalCard = result.data.cashDeskClosing[1] != undefined ? result.data.cashDeskClosing[1]["sum"] : 0;
        });
    }

    this.setCashDesk = function (customer_place) {
        var deferred = $q.defer();
        $http.get(API_ENDPOINT.url + '/cashDeskClosing?customer_place_id=' + customer_place.customer_place_id).then(function (result) {
            deferred.resolve(result.data);
        }, function (error) {
            deferred.reject(error);
        });
        return $q.when(deferred.promise);
    }
    this.saveCashDesk = function (cashDesk) {
        this.cashDesk = cashDesk;
        return $q(function (resolve, reject) {
            $http.post(API_ENDPOINT.url + '/saveCashDeskClosing', cashDesk).then(function (result) {
                if (result.data.success) {
                    resolve(result.data);
                } else {
                    reject(result.data.msg);
                }
            }).catch(function activateError(error) {
                reject(error.statusText);
            });
        });
    };
})