app.controller('CustomerNoteCtrl', function ($scope, CustomerNote) {

    $scope.closeCustomerNotesModal = function () {
        CustomerNote.closeModal();
    }
    $scope.saveCustomerNote = function () {
        CustomerNote.save($scope.customerNote).then(function (msg) {
            $scope.closeCustomerNotesModal();
        });
    }
    $scope.$watch(function () {
        return CustomerNote.customerNote;
    }, function (newVal) {
        $scope.customerNote = newVal;
    });
});