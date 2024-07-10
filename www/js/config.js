app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('outside', {
            url: '/outside',
            abstract: true,
            templateUrl: 'templates/outside.html'
        })
        .state('outside.login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
        })
        .state('outside.register', {
            url: '/register',
            templateUrl: 'templates/register.html',
            controller: 'RegisterCtrl'
        })
        .state('inside', {
            url: '/inside',
            templateUrl: 'templates/inside.html'
        }).state('ok', {
        url: '/ok',
        templateUrl: 'templates/oknotok.html',
        controller: 'OkCtrl'
    }).state('notok', {
        url: '/notok',
        templateUrl: 'templates/oknotok.html',
        controller: 'OkCtrl'
    });
    $urlRouterProvider.otherwise('/outside/login');
}).config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
}).directive('select', function () { //same as "ngSelect"
    return {
        restrict: 'E',
        scope: false,
        link: function (scope, ele) {
            ele.on('touchmove touchstart', function (e) {
                e.stopPropagation();
            })
        }
    }
});