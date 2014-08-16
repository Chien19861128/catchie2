'use strict';

//Setting up route
angular.module('mean.purchasables').config(['$stateProvider',
  function($stateProvider) {
    // Check if the user is connected
    var checkLoggedin = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') $timeout(deferred.resolve);

        // Not Authenticated
        else {
          $timeout(deferred.reject);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    // states for my app
    $stateProvider
      .state('all purchasables', {
        url: '/purchasables',
        templateUrl: 'purchasables/views/list.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('create purchasable', {
        url: '/purchasables/create',
        templateUrl: 'purchasables/views/create.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('edit purchasable', {
        url: '/purchasables/:purchasableName/edit',
        templateUrl: 'purchasables/views/edit.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('purchasable by id', {
        url: '/purchasables/:purchasableName',
        templateUrl: 'purchasables/views/view.html',
        resolve: {
          loggedin: checkLoggedin
        }
      });
  }
]);
