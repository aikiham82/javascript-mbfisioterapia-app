 app.service('History', function ($q, $http, $ionicPopup, Upload, API_ENDPOINT) {
     var self = this;
     this.reports = undefined;
     this.loadReports = function () {
         if (!this.reports) {
             this.reports = this.setReports();
         }
         return this.reports;
     }
     this.setReports = function () {
         return $q(function (resolve, reject) {
             $http.get(API_ENDPOINT.url + '/customerAttendeesReports').then(function (result) {
                 resolve(result.data.reports);
             });
         });
     }
     this.upload = function ($scope, $file) {
         if ($file) { //A veces se le da a cancelar

             Upload.upload({
                 url: API_ENDPOINT.url + '/uploadFile?',
                 params: {
                     attendee_id: $scope.attendee.attendee_id,
                     customer_attendee_report_id: $scope.report.selectedReport.customer_attendee_report_id
                 },
                 method: 'POST',
                 file: $file
             }).then(function (data) {
                 $scope.attendee.attendee_history_file = data.data.url;
                 $ionicPopup.alert({
                     title: 'Informes',
                     template: data.data.msg
                 });
             });
         }
     }
     this.loadReport = function ($scope) {
         return $q(function (resolve, reject) {

             $http.get(API_ENDPOINT.url + '/attendeeReport?attendee_id=' + $scope.attendee.attendee_id + '&customer_attendee_report_id=' + $scope.report.selectedReport.customer_attendee_report_id).then(function (result) {
                 resolve(result.data.report);
             });
         });
     }
 })