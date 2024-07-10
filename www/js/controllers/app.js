var app = angular.module('starter', ['ionic', 'ngCordova', 'ui.calendar', 'ionic-modal-select', 'textAngular', 'angularDateInterceptor', 'ngFileUpload', 'ui.grid', 'ui.grid.pagination', 'ionic-datepicker', 'signature'])
  .controller('AppCtrl', function (i18nService) {
    i18nService.setCurrentLang('es');

  }).run(function ($rootScope, $state, AuthService) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
      if (!AuthService.isAuthenticated()) {
        if (next.name !== 'outside.login' && next.name !== 'outside.register') {
          event.preventDefault();
          $state.go('outside.login');
        }
      }
    });
  });