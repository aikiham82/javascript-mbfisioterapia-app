app.service('CustomerEmployee', function () {
    this.customerEmployeeFilter = [];
    this.loadCustomerEmployees = function (freeCounters) {
        this.setCustomerEmployees(freeCounters);
    }
    this.setCustomerEmployees = function (freeCounters) {
        var customerEmployees_ = [{
            "customer_employee_id": null,
            "customer_employee_name": "TODOS"
        }];
        freeCounters.forEach(function (freeCounter) {
            if (customerEmployees_.find(function (element) {
                    return element.customer_employee_id == freeCounter.customer_employee_id;
                }) == undefined) {
                customerEmployees_.push(freeCounter);
            }
        });
        this.customerEmployees = customerEmployees_;
        (this.customerEmployeesNotAll = Object.assign([], this.customerEmployees)).shift();
    }
})