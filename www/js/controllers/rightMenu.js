app.controller('RightMenuCtrl', function ($scope, CustomerEmployee, CustomerPlace, CustomerActivity) {
    $scope.customerEmployeeSelect = function (newValue) {
        if ($scope.customerEmployee[newValue.customer_employee_id]) {
            CustomerEmployee.customerEmployeeFilter.push(newValue.customer_employee_id);
        } else {
            CustomerEmployee.customerEmployeeFilter.splice(CustomerEmployee.customerEmployeeFilter.indexOf(newValue.customer_employee_id), newValue.customer_employee_id);
        }
    };
    $scope.customerActivitySelect = function (newValue) {
        if ($scope.customerActivity[newValue.customer_activity_id]) {
            CustomerActivity.customerActivityFilter.push(newValue.customer_activity_id);
        } else {
            CustomerActivity.customerActivityFilter.splice(CustomerActivity.customerActivityFilter.indexOf(newValue.customer_activity_id), newValue.customer_activity_id);
        }
    };
    $scope.customerPlaceSelect = function (newValue) {
        if ($scope.customerPlace[newValue.customer_place_id]) {
            CustomerPlace.customerPlaceFilter.push(newValue.customer_place_id);
        } else {
            CustomerPlace.customerPlaceFilter.splice(CustomerPlace.customerPlaceFilter.indexOf(newValue.customer_place_id), newValue.customer_place_id);
        }
    };
    $scope.$watch(function () {
        return CustomerEmployee.customerEmployees;
    }, function (newVal) {
        if (newVal) {
            $scope.customerEmployees = newVal;
        }
    });
    $scope.$watch(function () {
        return CustomerEmployee.customerEmployeesNotAll;
    }, function (newVal) {
        if (newVal) {
            $scope.customerEmployees = newVal;
        }
    });

    $scope.$watch(function () {
        return CustomerPlace.customerPlacesNotAll;
    }, function (newVal) {
        if (newVal) {
            $scope.customerPlaces = newVal;
        }
    });
    $scope.$watch(function () {
        return CustomerActivity.customerActivities;
    }, function (newVal) {
        if (newVal) {
            $scope.customerActivities = newVal;
        }
    });
    resetFilters = function () {
        $scope.customerEmployee = {};
        $scope.customerPlace = {};
        $scope.customerActivity = {};
    }
    resetFilters();



});