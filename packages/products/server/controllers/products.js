'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
    Account = mongoose.model('Account'),
  _ = require('lodash');


/**
 * Find product by simple
 */
exports.product = function(req, res, next, simple) {
    //var simple = accountName + '-' + productSku + '-' + productSimple;
    console.log('[product][simple]' + simple);
    Product
        .findOne({
            simple: simple
        })
        .exec(function(err, product) {
            if (err) return next(err);
            if (!product) return next(new Error('Failed to load Product ' + simple));
			req.product = product;
            next();
        });
};

/**
 * Create a product
 */
exports.create = function(req, res) {
    var product = new Product(req.body);
    product._account = req.user._account;

	Account
        .findOne({
		    _id: req.user._account,
        }).exec(function(err, account) {
            if (err) {
                return res.json(500, {
                    error: 'Cannot save the product'
                });
            } else {
			    var simpleSplit = req.body.simple.split('-');
                console.log('[req.body.simple] ' + req.body.simple);
                if (account.name === simpleSplit[0] && simpleSplit.length===3) {
				    product.save(function(err) {
                        if (err) {
                            return res.send('users/signup', {
                                errors: err.errors,
                                product: product
                            });
                        } else {
                            res.jsonp(product);
                        }
                    });
				} else {
                    return res.status(500).json({
                        error: 'Cannot save the product'
                    });
				}
            }
        });
};

/**
 * Update a product
 */
exports.update = function(req, res) {
    
    console.log('[update][req.product]' + req.product);
    
    var product = req.product;

    product = _.extend(product, req.body);

    product.save(function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the product'
            });
        }
        res.json(product);

    });
};

/**
 * Delete a product
 */
exports.destroy = function(req, res) {
    var product = req.product;

    product.remove(function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot delete the product'
            });
        }
        res.json(product);

    });
};

/**
 * Show a product
 */
exports.show = function(req, res) {
    res.json(req.product);
};

/**
 * List of all discoverable Products
 */
exports.all = function(req, res) {
    console.log('[req.user._account]' + req.user._account);
    Product
	    .find({
		    is_discoverable:true,
			_account: {$ne: req.user._account}
		}).sort('-simple').exec(function(err, products) {
            if (err) {
                return res.status(500).json({
                    error: 'Cannot list the products'
                });
            } else {
                res.jsonp(products);
            }
        });
};


/**
 * List of own Products
 */
exports.me = function(req, res) {
    console.log('[req.user._account]' + req.user._account);
    Product
	    .find({
			_account: req.user._account
		}).sort('-simple').exec(function(err, products) {
            if (err) {
                return res.status(500).json({
                    error: 'Cannot list the products'
                });
            } else {
                res.jsonp(products);
            }
        });
};

/**
 * List of Products of a Vendor
 */
exports.accountAll = function(req, res) {
    console.log('[accountAll][accountName] ' + req.params.productSimple);
	
	Account
        .findOne({
		    _id: req.user._account,
        }).exec(function(err, account) {
            if (err) {
                return res.json(500, {
                    error: 'Cannot list the products'
                });
            } else {
			    var queryString;
				
			    var simpleSplit = req.params.productSimple.split('-');
                if (account.name === simpleSplit[0]) {
				    queryString = {
		                simple: new RegExp('^'+req.params.productSimple),
                        is_discoverable: true
                    };
				} else {
				    queryString = {
		                simple: new RegExp('^'+req.params.productSimple)
                    };
				}
				
				if (simpleSplit.length===3) {
                    Product
                        .findOne(queryString).sort('-simple').exec(function(err, product) {
                            if (err) {
                                return res.json(500, {
                                    error: 'Cannot list the products'
                                });
                            } else {
                                res.jsonp(product);
                            }
                        });
				} else {
                    Product
                        .find(queryString).sort('-simple').exec(function(err, products) {
                            if (err) {
                                return res.status(500).json({
                                    error: 'Cannot list the products'
                                });
                            } else {
                                res.jsonp(products);
                            }
                        });
				}
            }
        });
};
