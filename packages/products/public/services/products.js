'use strict';

//Products service used for products REST endpoint
angular.module('mean.products').factory('Products', ['$resource', function($resource) {
    return $resource('products/:simple', {
        //simple: '@simple'
    }, {
	    get: {method:'GET', params:{simple:'@simple'}},
	    getMe: {method:'GET', params:{simple:'me'}, isArray:true},
	    query: {method:'GET', isArray:true},
        post: {method:'POST'},
        update: { method: 'PUT', params:{simple:'@simple'}},
        remove: {method:'DELETE', params:{simple:'@simple'}}
    });
}]);