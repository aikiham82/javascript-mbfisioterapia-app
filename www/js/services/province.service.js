app.service('Province', function ($q, $http, API_ENDPOINT) {
    var self = this;
    this.provinces;
    this.getProvinces = function () {
        if (!this.provinces) {
            this.provinces = this.setProvinces()
        }
        return this.provinces;
    }
    this.setProvinces = function () {
        return $q(function (resolve, reject) {
            $http.get(API_ENDPOINT.url + '/provinces').then(function (result) {
                resolve(result.data.provinces);
            });
        });
    }
})