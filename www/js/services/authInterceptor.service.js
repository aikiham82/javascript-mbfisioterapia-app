app.factory('AuthInterceptor', ['$timeout', '$injector', '$q', function ($timeout, $injector, $q, $rootScope, Calendar, AUTH_EVENTS) {
    var requestInitiated = [];

    function showLoadingText() {
        $injector.get("$ionicLoading").show({
            template: '<img src="img/logo.png" width="100"/><p>Cargando...</p>',
        });
    };

    function hideLoadingText() {
        $injector.get("$ionicLoading").hide();
    };

    function showError(response) {
        var msg = response.data != null ? response.data.msg : "No se pudo conectar con el servidor. Avise al administrador"
        $injector.get("$ionicPopup").alert({
            title: 'Error!',
            template: msg
        });
        if ($injector.get("AuthService").isAuthenticated()) $injector.get("Calendar").loadServerEvents();
    };
    return {
        request: function (config) {
            if (!config.url.endsWith('.html')) {
                requestInitiated.push(true);
                showLoadingText();
            }
            return config;
        },
        response: function (response) {
            // Show delay of 300ms so the popup will not appear for multiple http request
            $timeout(function () {
                if (response.config.url.endsWith('.html')) return;
                requestInitiated.pop();
                if (requestInitiated.length == 0) hideLoadingText();
            }, 300);
            if (response.data.success === false) {
                showError(response);
            }
            return response;
        },
        requestError: function (err) {
            hideLoadingText();
            return err;
        },
        responseError: function (response) {
            if (!$rootScope) {
                showError(response);
                hideLoadingText();
                requestInitiated.pop();
            } else {
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                } [response.status], response);
            }
            return $q.reject(response);
        }
    };
}])