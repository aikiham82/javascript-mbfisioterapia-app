angular.module('ionic-datepicker.service', [])

  .service('IonicDatepickerService', function () {

    this.getYearsList = function (from, to) {
      var yearsList = [];
      var minYear = 1900;
      var maxYear = 2100;

      minYear = from ? new Date(from).getFullYear() : minYear;
      maxYear = to ? new Date(to).getFullYear() : maxYear;

      for (var i = minYear; i <= maxYear; i++) {
        yearsList.push(i);
      }

      return yearsList;
    };

    // item has "value" and "text" json keys
    this.getMonthsList = function (monthNames, from, to, year) {
      var monthsList = [];
      var minMonth = 0;
      var maxMonth = 11;

      if(from) {
          var dFrom = new Date(from);
          if(year == dFrom.getFullYear()) {
              minMonth = dFrom.getMonth();
          }
      }
        if(to) {
            var dTo = new Date(to);
            if(year == dTo.getFullYear()) {
                maxMonth = dTo.getMonth();
            }
        }

      for (var i = 0; i <= 11; i++) {
          if (i >= minMonth && i <= maxMonth) {
              monthsList.push({value: i, text: monthNames[i]});
          }
      }
      return monthsList;
    };

      this.getMonthsNames = function (configNames) {
          if (configNames && configNames.length === 12) {
              return configNames;
          }
          return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      };
  });
