app.service('Location', function ($q, $http, API_ENDPOINT) {
    var self = this;
    this.locations = undefined;
    this.getLocations = function (province_id) {
        if (!this.locations) {
            this.locations = this.setLocations(province_id)
        }
        return this.locations;
    }
    this.setLocations = function (province_id) {
        return $q(function (resolve) {
            $http.get(API_ENDPOINT.url + '/locationsByProvince?province_id=' + province_id).then(function (result) {
                resolve(result.data.locations);
            });
        });
    }
})