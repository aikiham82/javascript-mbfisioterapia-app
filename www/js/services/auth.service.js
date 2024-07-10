app.service('AuthService', function ($q, $http, $window, API_ENDPOINT) {
    var self = this;
    var LOCAL_TOKEN_KEY = 'yourTokenKey';
    var isAuthenticated = false;
    var authToken;
    function loadUserCredentials() {
        var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        if (token) {
            useCredentials(token);
        }
    }
    function storeUserCredentials(token) {
        window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
        useCredentials(token);
    }
    function useCredentials(token) {
        isAuthenticated = true;
        authToken = token;
        // Set the token as header for your requests!
        $http.defaults.headers.common.Authorization = authToken;
    }
    function destroyUserCredentials() {
        authToken = undefined;
        isAuthenticated = false;
        $http.defaults.headers.common.Authorization = undefined;
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    }
    var register = function (user) {
        return $q(function (resolve, reject) {
            $http.post(API_ENDPOINT.url + '/signup', user).then(function (result) {
                if (result.data.succes) {
                    resolve(result.data.msg);
                } else {
                    reject(result.data.msg);
                }
            }).catch(function activateError(error) {
                reject(error.statusText);
            });
        });
    };
    var getAuthenticatedUser = function () {
        return self.authenticatedUser;
    }
    var login = function (user) {
        return $q(function (resolve, reject) {
            $http.post(API_ENDPOINT.url + '/authenticate', user).then(function (result) {
                if (result.data.success) {
                    self.authenticatedUser = user;
                    if (user.remember) {
                        window.localStorage.setItem("username", user.name);
                        window.localStorage.setItem("password", user.password);
                    }
                    window.localStorage.setItem("remember", user.remember);
                    storeUserCredentials(result.data.token);
                    resolve(result.data.msg);
                } else {
                    reject(result.data.msg);
                }
            }).catch(function activateError(error) {
                reject(error.statusText);
            });
        });
    };
    var changePassword = function (user) {
        return $q(function (resolve, reject) {
            $http.post(API_ENDPOINT.url + '/changePassword', user).then(function (result) {
                if (result.data.success) {
                    resolve(result.data.msg);
                } else {
                    reject(result.data.msg);
                }
            }).catch(function activateError(error) {
                reject(error.statusText);
            });
        });
    };
    var logout = function () {
        destroyUserCredentials();
        $window.location.reload();
    };
    loadUserCredentials();
    return {
        login: login,
        getAuthenticatedUser: getAuthenticatedUser,
        register: register,
        changePassword: changePassword,
        logout: logout,
        isAuthenticated: function () {
            return isAuthenticated;
        },
    };
})