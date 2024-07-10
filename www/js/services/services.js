/************************ hasta aqui el AuthService, lo demas ira quitado */
/*var saveScheduleCalendar = function (scheduleCalendar) {
    return $q(function (resolve, reject) {
      $http.post(API_ENDPOINT.url + '/saveScheduleCalendar', scheduleCalendar).then(function (result) {
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

  var saveAttendee = function (attendee) {
    if (Array.isArray(attendee)) attendee = attendee[0];
    return $q(function (resolve, reject) {
      $http.post(API_ENDPOINT.url + '/saveAttendee', attendee).then(function (result) {
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


 
  var saveCashDeskClosing = function (cashDeskClosing) {
    return $q(function (resolve, reject) {
      $http.post(API_ENDPOINT.url + '/saveCashDeskClosing', cashDeskClosing).then(function (result) {
        if (result.data.success) {
          resolve(result.data);
        } else {
          reject(result.data.msg);
        }
      }).catch(function activateError(error) {
        reject(error.statusText);
      });
    });
  };
  var saveSaleInvoice = function (moneyMovement) {
    return $q(function (resolve, reject) {
      $http.post(API_ENDPOINT.url + '/saveSaleInvoice', moneyMovement).then(function (result) {
        if (result.data.success) {
          resolve(result.data);
        } else {
          reject(result.data.msg);
        }
      }).catch(function activateError(error) {
        reject(error.statusText);
      });
    });
  };
 var uploadFile= function(file) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/saveSaleInvoice', moneyMovement).then(function(result) {
        if (result.data.success) {
          resolve(result.data);
        } else {
          reject(result.data.msg);
        }
      }).catch(function activateError(error) {
        reject(error.statusText);
      });
    });
  };
  var attendance_notattendance = function (event, customer_activity, attendees) {

  };*/