'use strict';

//Accounts service used for accounts REST endpoint
angular.module('mean.accounts').factory('Accounts', ['$resource', function($resource) {
    return $resource('accounts/:name', {
        accountId: '@_id',
        name: '@name',
        phone: '@phone',
        email: '@email',
        status: '@status',
        userGroups: '@user_groups'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);