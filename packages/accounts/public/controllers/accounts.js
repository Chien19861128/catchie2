'use strict';

angular.module('mean.accounts').controller('AccountsController', ['$scope', '$stateParams', '$location', 'Global', 'Accounts',
  function($scope, $stateParams, $location, Global, Accounts) {
    $scope.global = Global;

    $scope.update = function(isValid) {
        if (isValid) {
            var account = $scope.account;
            if (!account.updated) {
                account.updated = [];
            }
            account.updated.push(new Date().getTime());

            account.$update(function() {
                $location.path('accounts/' + account.name);
            });
        } else {
            $scope.submitted = true;
        }
    };

    $scope.find = function() {
        Accounts.query(function(accounts) {
            $scope.accounts = accounts;
        });
    };

    $scope.findOne = function() {
        Accounts.get({
            name: $stateParams.name
        }, function(account) {
            $scope.account = account;
        });
    };

    $scope.findMe = function() {
        Accounts.get({
            name: 'me'
        }, function(account) {
            $scope.account = account;
        });
    };
}]);
