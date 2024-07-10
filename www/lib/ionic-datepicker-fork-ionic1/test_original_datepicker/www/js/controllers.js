angular.module('starter.controllers', [])

// Controleur general de l'application
  .controller('mainController', ['$scope', 'ionicDatePicker',
    function ($scope, ionicDatePicker) {

    $scope.options = {
      start : "sunday",
      style: "modal",
      range: "day",
      today: "not_today",
      close: "do_not_close",
      disableDates: "none"
    };

    $scope.openDatePicker = function() {
      var ipObj1 = {
        callback: function (val) {  //Mandatory
          console.debug("callback called");
          if(val.start) {
            $scope.datepicker1 = new Date(val.start) + " - " + new Date(val.end);
          } else {
            $scope.datepicker1 = new Date(val);
          }

        },
        mondayFirst: $scope.options.start == "monday",          //Optional
        closeOnSelect: $scope.options.close == "close",       //Optional
        templateType: $scope.options.style,       //Optional
        selectMode: $scope.options.range, //Optional
        showTodayButton: $scope.options.today == "today" //Optional
      };

      if($scope.options.disableDates == "none") {
        ipObj1.from = null;
        ipObj1.to = null;
      } else if($scope.options.disableDates == "year") {
        ipObj1.from = new Date(2012, 0, 1);
        ipObj1.to = new Date(2018, 11, 31);
      } else if($scope.options.disableDates == "month") {
        // from 03-01-2017 to 08-31-2017
        ipObj1.from = new Date(2017, 2, 1);
        ipObj1.to = new Date(2017, 7, 31);
      } else if($scope.options.disableDates == "special") {
        // from 03-12-2017 to 10-18-2017
        ipObj1.from = new Date(2017, 2, 12);
        ipObj1.to = new Date(2017, 9, 18);
      } else if($scope.options.disableDates == "special2") {
        // from 03-12-2017 to 10-18-2018
        ipObj1.from = new Date(2017, 2, 12);
        ipObj1.to = new Date(2018, 9, 18);
      }

      ionicDatePicker.openDatePicker(ipObj1);
    };
    }]);
