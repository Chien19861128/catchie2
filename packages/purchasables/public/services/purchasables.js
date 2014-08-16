'use strict';

//Purchasables service used for purchasables REST endpoint
angular.module('mean.purchasables').factory('Purchasables', ['$resource', function($resource) {
    return $resource('purchasables/:purchasableName', {
        //purchasableName: '@name'
    }, {
        get: {method:'GET', params:{purchasableName:'@name'}},
        getMe: {method:'GET', params:{purchasableName:'me'}, isArray:true},
        query: {method:'GET', isArray:true},
        post: {method:'POST'},
        update: { method: 'PUT', params:{purchasableName:'@name'}},
        remove: {method:'DELETE', params:{purchasableName:'@name'}}
    });
}]);

//PurchasableCarts service used for purchasables REST endpoint
angular.module('mean.purchasables').factory('PurchasableCarts', ['$resource', function($resource) {
    return $resource('purchasables/:purchasableName/cart', {
        //purchasableName: '@name'
    }, {
        post: {method:'POST', params:{purchasableName:'@name'}},
        update: { method: 'PUT', params:{purchasableName:'@name'}, isArray:true}
    });
}]);