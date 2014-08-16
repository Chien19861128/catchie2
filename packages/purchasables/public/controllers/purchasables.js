'use strict';

angular.module('mean.purchasables').controller('PurchasablesController', ['$scope', '$stateParams', '$location', 'Global', 'Purchasables',
  function($scope, $stateParams, $location, Global, Purchasables) {
    $scope.global = Global;

    $scope.hasAuthorization = function(purchasable) {
      if (!purchasable || !purchasable.user) return false;
      return $scope.global.isAdmin || purchasable.user._id === $scope.global.user._id;
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var purchasable = new Purchasables({
          title: this.title,
          content: this.content
        });
        article.$save(function(response) {
          $location.path('purchasables/' + response._id);
        });

        this.title = '';
        this.content = '';
      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(purchasable) {
      if (purchasable) {
        purchasable.$remove();

        for (var i in $scope.purchasables) {
          if ($scope.purchasables[i] === purchasable) {
            $scope.purchasables.splice(i, 1);
          }
        }
      } else {
        $scope.purchasable.$remove(function(response) {
          $location.path('purchasables');
        });
      }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var purchasable = $scope.purchasable;
        if (!purchasable.updated) {
          purchasable.updated = [];
        }
        purchasable.updated.push(new Date().getTime());

        purchasable.$update(function() {
          $location.path('purchasables/' + purchasable._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.find = function() {
      Purchasables.query(function(purchasables) {
        $scope.purchasables = purchasables;
      });
    };

    $scope.findOne = function() {
      Purchasables.get({
        purchasableName: $stateParams.purchasableName
      }, function(purchasable) {
        $scope.purchasable = purchasable;
      });
    };
  }
]);
