'use strict';

angular.module('mean.products').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Global', 'Products', 'Accounts',
  function($scope, $stateParams, $location, Global, Products, Accounts) {
    $scope.global = Global;

    Accounts.get({
        name: 'me'
    }, function(account) {
	    console.log(account);
        $scope.account = account;
    });
      
    $scope.hasAuthorization = function(product) {
        if (!product || !product.user) return false;
        return $scope.global.isAdmin || product.user._id === $scope.global.user._id;
    };

    $scope.create = function(isValid) {
        if (isValid) {
            console.log('[simple] ' + $scope.account.name + '-' + this.simple);
            var product = new Products({
                _account: this._account,
                simple: $scope.account.name + '-' + this.simple,
                name: this.name,
                category: this.category,
                currency: this.currency,
                original_price: this.original_price,
                special_price: this.special_price,
                price: this.price,
                description: this.description,
                is_show_price: this.is_show_price,
                is_discoverable: this.is_discoverable,
                custom_fields: this.custom_fields,
                created: this.created
            });
            product.$save(function(response) {
                $location.path('products/' + response.simple);
            });

            this._account = '';
            this.simple = '';
            this.name = '';
            this.category = '';
            this.currency = '';
            this.original_price = '';
            this.special_price = '';
            this.price = '';
            this.description = '';
            this.is_show_price = '';
            this.is_discoverable = '';
            this.custom_fields = '';
            this.created = '';
        } else {
            $scope.submitted = true;
        }
    };

    $scope.remove = function(product) {
        if (product) {
            product.$remove();

            for (var i in $scope.products) {
                if ($scope.products[i] === product) {
                    $scope.products.splice(i, 1);
                }
            }
        } else {
            $scope.product.$remove(function(response) {
                $location.path('products');
            });
        }
    };

    $scope.update = function(isValid) {
        if (isValid) {
            var product = $scope.product;
            if (!product.updated) {
                product.updated = [];
            }
            product.updated.push(new Date().getTime());

            product.$update(function() {
                $location.path('products/' + product.simple);
            });
        } else {
            $scope.submitted = true;
        }
    };

    $scope.find = function() {
        Products.getMe(function(products) {
            $scope.products = products;
        });
    };


    $scope.findOne = function() {
        console.log('[findOne.simpel]' + $stateParams.simple);
        Products.get({
            simple: $stateParams.simple
        }, function(product) {
            $scope.product = product;
        });
    };
      
}]);
