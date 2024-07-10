angular.module('ionic-datepicker.provider', [])

  .provider('ionicDatePicker', function () {

    var config = {
      titleLabel: null,
      setLabel: 'Set',
      todayLabel: 'Today',
      closeLabel: 'Close',
      inputDate: new Date(),
      mondayFirst: true,
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      showTodayButton: false,
      closeOnSelect: false,
      disableWeekdays: [],
      selectMode: 'day'
    };

    this.configDatePicker = function (inputObj) {
      angular.extend(config, inputObj);
    };

    this.$get = ['$rootScope', '$ionicPopup', '$ionicModal', 'IonicDatepickerService', function ($rootScope, $ionicPopup, $ionicModal, IonicDatepickerService) {

      var provider = {};

      var $scope = $rootScope.$new();
      $scope.today = resetHMSM(new Date()).getTime();
      $scope.disabledDates = [];
      $scope.data = {};

      //Reset the hours, minutes, seconds and milli seconds
      function resetHMSM(currentDate) {
        currentDate.setHours(0);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);
        return currentDate;
      }

      //Previous month
      $scope.prevMonth = function () {
        var selectedDate = new Date($scope.selctedDateEpoch);
        var newDay = getAcceptableDay(selectedDate.getDate(),
            selectedDate.getMonth() - 1,
            selectedDate.getFullYear() - (selectedDate.getMonth() == 0 ? 1 : 0));

        var newDate = resetHMSM(new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth() - 1, newDay));

        var fromDateTmp = new Date($scope.fromDate);
        if (newDate.getFullYear() < fromDateTmp.getFullYear()
            || (newDate.getFullYear() == fromDateTmp.getFullYear() && newDate.getMonth() < fromDateTmp.getMonth()))
            return;

        if((newDate.getFullYear() == fromDateTmp.getFullYear() && newDate.getMonth() == fromDateTmp.getMonth())) {
            if(newDate.getDate() < fromDateTmp.getDate()) {
                newDate.setDate(fromDateTmp.getDate());
            }
        }

        $scope.currentDate = newDate;
        $scope.data.currentMonth = findMonth($scope.currentDate.getMonth(), $scope.monthsList);
        $scope.data.currentYear = $scope.currentDate.getFullYear();
        $scope.adjustSelctedDateEpoch($scope.currentDate, true);
        refreshDateList($scope.currentDate);
      };

      //Next month
      $scope.nextMonth = function () {
        var selectedDate = new Date($scope.selctedDateEpoch);
        var newDay = getAcceptableDay(selectedDate.getDate(),
            selectedDate.getMonth() + 1,
            selectedDate.getFullYear() + (selectedDate.getMonth() == 11 ? 1 : 0));

        var newDate = resetHMSM(new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth() + 1, newDay));

        var toDateTmp = new Date($scope.toDate);
        if (newDate.getFullYear() > toDateTmp.getFullYear()
            || (newDate.getFullYear() == toDateTmp.getFullYear() && newDate.getMonth() > toDateTmp.getMonth()))
            return;

        if((newDate.getFullYear() == toDateTmp.getFullYear() && newDate.getMonth() == toDateTmp.getMonth())) {
            if(newDate.getDate() > toDateTmp.getDate()) {
                newDate.setDate(toDateTmp.getDate());
            }
        }

        $scope.currentDate = newDate;
        $scope.data.currentMonth = findMonth($scope.currentDate.getMonth(), $scope.monthsList);
        $scope.data.currentYear = $scope.currentDate.getFullYear();
        $scope.adjustSelctedDateEpoch($scope.currentDate, true);
        refreshDateList($scope.currentDate);
      };

      var findMonth = function(monthId, scopeMonthList) {
        for(var i = 0; i < scopeMonthList.length; i++) {
          if(scopeMonthList[i].value === monthId) {
            return scopeMonthList[i];
          }
        }
        return scopeMonthList[0];
      };

        //Get the acceptable day
        var getAcceptableDay = function(currentDay, newMonth, newYear) {
            var nbDaysInMonth = new Date(newYear, newMonth+1, 0).getDate();
            if(currentDay > nbDaysInMonth) {
                currentDay = nbDaysInMonth;
            }
            return currentDay;
        };

      //Date selected
      $scope.dateSelected = function (selectedDate) {
        if (!selectedDate || Object.keys(selectedDate).length === 0)
          return;
        $scope.adjustSelctedDateEpoch(selectedDate, false);
        if ($scope.mainObj.closeOnSelect) {
          $scope.mainObj.callback($scope.mainObj.selectMode == 'day'
              ? $scope.selctedDateEpoch
              : { start: $scope.selctedDateEpoch, end: $scope.selctedDateEpochEndWeek });
          if ($scope.mainObj.templateType.toLowerCase() == 'popup') {
            $scope.popup.close();
          } else {
            closeModal();
          }
      }
      };

      //Set today as date for the modal
      $scope.setIonicDatePickerTodayDate = function () {
        var today = resetHMSM(new Date());
        $scope.adjustSelctedDateEpoch(today, true);
        refreshDateList(today);
      };

      //Set date for the modal
      $scope.setIonicDatePickerDate = function () {
          $scope.mainObj.callback($scope.mainObj.selectMode == 'day'
              ? $scope.selctedDateEpoch
              : { start: $scope.selctedDateEpoch, end: $scope.selctedDateEpochEndWeek });
          closeModal();
      };

        // Adjust $scope.selctedDateEpoch and $scope.selctedDateEpochEndWeek in case
        // select mode is week, with value from param date
        // @param selectedDate - an item of $scope.dayList or a Date
        // @param initialSelRawDate - when true, initial selection and Date value passed.
        // When false, event call and item of $scope.dayList passed.
        $scope.adjustSelctedDateEpoch = function(selectedDate, initialSelRawDate) {
            var selectedTime = initialSelRawDate ? selectedDate.getTime() : selectedDate.epoch;
            var d;
            if($scope.mainObj.selectMode == 'week') {
                d = new Date(selectedTime);
                if($scope.mainObj.mondayFirst) {
                    d.setDate(d.getDate() - new Date(selectedTime).getDay() + 1);
                } else {
                    d.setDate(d.getDate() - new Date(selectedTime).getDay());
                }
                selectedTime = d.getTime();
                d.setDate(d.getDate() + 6);
                $scope.selctedDateEpochEndWeek = d.getTime();
            } else if($scope.mainObj.selectMode == 'month') {
                d = new Date(selectedTime);
                d.setDate(1);
                selectedTime = d.getTime();
                var nbDaysInMonth = new Date(d.getYear(), d.getMonth()+1, 0).getDate();
                d = new Date(d.getFullYear(), d.getMonth(), nbDaysInMonth);
                $scope.selctedDateEpochEndWeek = d.getTime();
            }
            $scope.selctedDateEpoch = selectedTime;
        };

        //Setting the disabled dates list.
      function setDisabledDates(mainObj) {
        if (!mainObj.disabledDates || mainObj.disabledDates.length === 0) {
          $scope.disabledDates = [];
        } else {
          $scope.disabledDates = [];
          angular.forEach(mainObj.disabledDates, function (val, key) {
            val = resetHMSM(new Date(val));
            $scope.disabledDates.push(val.getTime());
          });
        }
      }

      //Refresh the list of the dates of a month
      function refreshDateList(currentDate) {
        currentDate = resetHMSM(currentDate);
        $scope.currentDate = angular.copy(currentDate);

        var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDate();
        var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

        // all month name
        $scope.monthsNames = IonicDatepickerService.getMonthsNames($scope.mainObj.monthsList);

        // available months
        $scope.monthsList = {};
        $scope.monthsList.months = IonicDatepickerService.getMonthsList($scope.monthsNames, $scope.mainObj.from, $scope.mainObj.to, currentDate.getFullYear());
        $scope.yearsList = IonicDatepickerService.getYearsList($scope.mainObj.from, $scope.mainObj.to, currentDate.getFullYear());

        $scope.dayList = [];

        var tempDate, disabled;
        $scope.firstDayEpoch = resetHMSM(new Date(currentDate.getFullYear(), currentDate.getMonth(), firstDay)).getTime();
        $scope.lastDayEpoch = resetHMSM(new Date(currentDate.getFullYear(), currentDate.getMonth(), lastDay)).getTime();

        for (var i = firstDay; i <= lastDay; i++) {
          tempDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
          disabled = (tempDate.getTime() < $scope.fromDate) || (tempDate.getTime() > $scope.toDate) || $scope.mainObj.disableWeekdays.indexOf(tempDate.getDay()) >= 0;

          $scope.dayList.push({
            date: tempDate.getDate(),
            month: tempDate.getMonth(),
            year: tempDate.getFullYear(),
            day: tempDate.getDay(),
            epoch: tempDate.getTime(),
            disabled: disabled
          });
        }

        //To set Monday as the first day of the week.
        var firstDayMonday = $scope.dayList[0].day - $scope.mainObj.mondayFirst;
        firstDayMonday = (firstDayMonday < 0) ? 6 : firstDayMonday;

        for (var j = 0; j < firstDayMonday; j++) {
          $scope.dayList.unshift({});
        }

        $scope.rows = [0, 7, 14, 21, 28, 35];
        $scope.cols = [0, 1, 2, 3, 4, 5, 6];

        $scope.data.currentMonth = findMonth($scope.currentDate.getMonth(), $scope.monthsList.months);
        $scope.data.currentYear = currentDate.getFullYear();
        $scope.data.currentMonthSelected = angular.copy($scope.data.currentMonth);
        $scope.currentYearSelected = angular.copy($scope.data.currentYear);
        $scope.numColumns = 7;
      }

      //Month changed
      $scope.monthChanged = function (monthNumber) {
        var selectedDate = new Date($scope.selctedDateEpoch);
        var newDay = getAcceptableDay(selectedDate.getDate(),
            monthNumber,
            selectedDate.getFullYear());

          var newDate = resetHMSM(new Date($scope.currentDate.getFullYear(), monthNumber, newDay));

          var toDateTmp = new Date($scope.toDate);
          if (newDate.getFullYear() > toDateTmp.getFullYear()
              || (newDate.getFullYear() == toDateTmp.getFullYear() && newDate.getMonth() > toDateTmp.getMonth()))
              return;

          if((newDate.getFullYear() == toDateTmp.getFullYear() && newDate.getMonth() == toDateTmp.getMonth())) {
              if(newDate.getDate() > toDateTmp.getDate()) {
                  newDate.setDate(toDateTmp.getDate());
              }
          }

          var fromDateTmp = new Date($scope.fromDate);
          if (newDate.getFullYear() < fromDateTmp.getFullYear()
              || (newDate.getFullYear() == fromDateTmp.getFullYear() && newDate.getMonth() < fromDateTmp.getMonth()))
              return;

          if((newDate.getFullYear() == fromDateTmp.getFullYear() && newDate.getMonth() == fromDateTmp.getMonth())) {
              if(newDate.getDate() < fromDateTmp.getDate()) {
                  newDate.setDate(fromDateTmp.getDate());
              }
          }

        $scope.currentDate = newDate;
        $scope.adjustSelctedDateEpoch($scope.currentDate, true);
        refreshDateList($scope.currentDate);
      };

      //Year changed
      $scope.yearChanged = function (year) {
         var selectedDate = new Date($scope.selctedDateEpoch);
         var newDay = getAcceptableDay(selectedDate.getDate(),
            selectedDate.getMonth(),
            year);

         var newDate = resetHMSM(new Date(year, $scope.currentDate.getMonth(), newDay));

         var toDateTmp = new Date($scope.toDate);
         if (newDate.getFullYear() > toDateTmp.getFullYear()
             || (newDate.getFullYear() == toDateTmp.getFullYear() && newDate.getMonth() > toDateTmp.getMonth()))
         {
             // Out of allowed dates
             newDate = toDateTmp;
             $scope.currentDate = newDate;
             $scope.adjustSelctedDateEpoch($scope.currentDate, true);
             refreshDateList($scope.currentDate);
             return;
         }

         if((newDate.getFullYear() == toDateTmp.getFullYear() && newDate.getMonth() == toDateTmp.getMonth())) {
              if(newDate.getDate() > toDateTmp.getDate()) {
                  newDate.setDate(toDateTmp.getDate());
              }
         }

          var fromDateTmp = new Date($scope.fromDate);
          if (newDate.getFullYear() < fromDateTmp.getFullYear()
              || (newDate.getFullYear() == fromDateTmp.getFullYear() && newDate.getMonth() < fromDateTmp.getMonth()))
          {
              // Out of allowed dates
              newDate = fromDateTmp;
              $scope.currentDate = newDate;
              $scope.adjustSelctedDateEpoch($scope.currentDate, true);
              refreshDateList($scope.currentDate);
              return;
          }

          if((newDate.getFullYear() == fromDateTmp.getFullYear() && newDate.getMonth() == fromDateTmp.getMonth())) {
              if(newDate.getDate() < fromDateTmp.getDate()) {
                  newDate.setDate(fromDateTmp.getDate());
              }
          }

          $scope.currentDate = newDate;
          $scope.adjustSelctedDateEpoch($scope.currentDate, true);
          refreshDateList($scope.currentDate);
      };

      //Setting up the initial object
      function setInitialObj(ipObj) {
        $scope.mainObj = angular.copy(ipObj);
        $scope.mainObj.inputDate = resetHMSM($scope.mainObj.inputDate);
        $scope.adjustSelctedDateEpoch($scope.mainObj.inputDate, true);

          if ($scope.mainObj.weeksList && $scope.mainObj.weeksList.length === 7) {
          $scope.weeksList = $scope.mainObj.weeksList;
        } else {
          $scope.weeksList = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        }
        if ($scope.mainObj.mondayFirst) {
          $scope.weeksList.push($scope.mainObj.weeksList.shift());
        }
        $scope.disableWeekdays = $scope.mainObj.disableWeekdays;

        refreshDateList($scope.mainObj.inputDate);
        setDisabledDates($scope.mainObj);
      }

      $ionicModal.fromTemplateUrl('ionic-datepicker-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
      });

      $scope.$on('$destroy', function () {
        $scope.modal.remove();
      });

      function openModal() {
        $scope.modal.show();
      }

      function closeModal() {
        $scope.modal.hide();
      }

      $scope.closeIonicDatePickerModal = function () {
        closeModal();
      };

      //Open datepicker popup
      provider.openDatePicker = function (ipObj) {
        var buttons = [];
        delete $scope.fromDate;
        delete $scope.toDate;

        $scope.mainObj = angular.extend({}, config, ipObj);
        if ($scope.mainObj.from) {
          $scope.fromDate = resetHMSM(new Date($scope.mainObj.from)).getTime();
        }
        if ($scope.mainObj.to) {
          $scope.toDate = resetHMSM(new Date($scope.mainObj.to)).getTime();
        }

        if (ipObj.disableWeekdays && config.disableWeekdays) {
          $scope.mainObj.disableWeekdays = ipObj.disableWeekdays.concat(config.disableWeekdays);
        }
        setInitialObj($scope.mainObj);

          buttons = [{
              text: $scope.mainObj.closeLabel,
              type: 'button_close',
              onTap: function (e) {
                  console.log('ionic-datepicker popup closed.');
              }
          }];

          if ($scope.mainObj.showTodayButton) {
              buttons.push({
                  text: $scope.mainObj.todayLabel,
                  type: 'button_today',
                  onTap: function (e) {
                      var today = resetHMSM(new Date());
                      $scope.adjustSelctedDateEpoch(today, true);
                      refreshDateList(today);
                      e.preventDefault();
                  }
              });
          }

        if (!$scope.mainObj.closeOnSelect) {
          buttons.push({
            text: $scope.mainObj.setLabel,
            type: 'button_set',
            onTap: function (e) {
                $scope.mainObj.callback($scope.mainObj.selectMode == 'day'
                    ? $scope.selctedDateEpoch
                    : { start: $scope.selctedDateEpoch, end: $scope.selctedDateEpochEndWeek });
            }
          });
        }

        if ($scope.mainObj.templateType.toLowerCase() == 'popup') {
          $scope.popup = $ionicPopup.show({
            templateUrl: 'ionic-datepicker-popup.html',
            scope: $scope,
            cssClass: 'ionic_datepicker_popup',
            buttons: buttons
          });
        } else {
          openModal();
        }
      };

      return provider;

    }];

  });
