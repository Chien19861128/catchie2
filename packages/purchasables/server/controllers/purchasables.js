'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Purchasable = mongoose.model('Purchasable'),
    Account = mongoose.model('Account'),
    _ = require('lodash');

/**
 * Find purchasable by name
 */
exports.purchasable = function(req, res, next, fullPurchasableName) {
    var splitPurchasableName = fullPurchasableName.split('-');
    var vendorName = splitPurchasableName[0];
	
	Account
        .findOne({
		    _id: req.user._account,
        }).exec(function(err, account) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else if (!account) {
                return next(new Error('Failed to load, Purchasable does not exist'));
            } else {
                Purchasable
                    .findOne({
                        name: fullPurchasableName,
            			buyer: vendorName
                    })
                    .exec(function(err, purchasable) {
                        if (err) return next(err);
                        if (!purchasable) return next(new Error('Failed to load Purchasable ' + fullPurchasableName));
			            req.purchasable = purchasable;
                        next();
                    });
            }
        });
};

/**
 * Create an purchasable
 */
exports.create = function(req, res) {
    var purchasable = new Purchasable(req.body);
    purchasable._account = req.user._account;

	Account
        .findOne({
		    _id: req.user._account,
        }).exec(function(err, account) {
            if (err) {
                return res.status(500).json({
                    error: 'Cannot save the purchasable'
                });
            } else {
			    var simpleSplit = req.body.simple.split('-');
                if (account.name === simpleSplit[0] && simpleSplit.length === 2) {
				    purchasable.save(function(err) {
                        if (err) {
                            return res.send('users/signup', {
                                errors: err.errors,
                                purchasable: purchasable
                            });
                        } else {
                            res.jsonp(purchasable);
                        }
                    });
				} else {
                    return res.status(500).json({
                        error: 'Cannot save the purchasable'
                    });
				}
            }
        });
};

/**
 * Update an purchasable
 */
exports.update = function(req, res) {
    var purchasable = req.purchasable;

    purchasable = _.extend(purchasable, req.body);

    purchasable.save(function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the purchasable'
            });
        }
        res.jsonp(purchasable);
    });
};

/**
 * Delete an purchasable
 */
exports.destroy = function(req, res) {
    var purchasable = req.purchasable;

    purchasable.remove(function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot delete the purchasable'
            });
        }
        res.json(purchasable);

    });
};

/**
 * Show an purchasable
 */
exports.show = function(req, res) {
    res.json(req.purchasable);
};

/**
 * List of Purchasables
 */
exports.all = function(req, res) {
	
	Account
        .findOne({
		    _id: req.user._account,
        }).exec(function(err, account) {
        
            if (err) {
                return res.status(500).json({
                    error: 'Cannot find purchasables'
                });
            }
        
            Purchasable
                .find({
        			buyer: account.name
                })
                .exec(function(err, purchasables) {
                    if (err) {
                        return res.status(500).json({
                            error: 'Cannot find purchasables'
                        });
                    }
                    res.jsonp(purchasables);
                });
        });
};

/**
 * List of own Purchasables
 */
exports.me = function(req, res) {
    console.log('[req.user._account]' + req.user._account);
    Purchasable
	    .find({
			_account: req.user._account
		}).sort('-simple').exec(function(err, purchasables) {
            if (err) {
                return res.status(500).json({
                    error: 'Cannot find purchasables'
                });
            } else {
                res.jsonp(purchasables);
            }
        });
};

/**
 * Add Cart Item
 */
exports.addCartItem = function(req, res) {
    console.log('[accountAll][accountName] ' + req.params.productSimple);
	
	Account
        .findOne({
		    _id: req.user._account,
        }).exec(function(err, account) {
            if (err) {
                return res.status(500).json({
                    error: 'Cannot add to cart'
                });
            }
            var simpleSplit = req.params.productSimple.split('-');
            if (account.name === simpleSplit[0] && simpleSplit.length===3) {
				    
                Purchasable
                    .findOne({
                        name: req.params.purchasableName,
        			    buyer: account.name
                    })
                    .exec(function (err, purchasable) {
                        if (err) return err;
                        if (!purchasable) return new Error('Failed to load Purchasable ' + name);
							
                        var is_incart = 0;
                            
                        for (var i in purchasable.cart_item) {
                            if (purchasable.cart_item[i]._simple === req.body.simple){
                                    
	                            purchasable.cart_item[i].quantity = purchasable.cart_item[i].quantity + req.body.quantity;
                                  
                                is_incart = 1;
                            }
                        }
                            
                        if (is_incart) {
                            purchasable.save(function(err) {
                                if (err) {
                                    return res.send('users/signup', {
                                        errors: err.errors,
                                        purchasable: purchasable
                                    });
                                }
                            });
                            return res.jsonp(purchasable.cart_item);
                                
                        } else {
	                        purchasable.cart_item
                                .push({
			                        _simple: req.body.simple,
			                        quantity: req.body.quantity
		                        }).exec(function(err, purchasable) {
                                    if (err) {
                                        return res.status(500).json({
                                            error: 'Cannot add to cart'
                                        });
                                    }
                                    res.jsonp(purchasable.cart_item);
                                });
                            }
                        });
				}
        });
};

/**
 * Update Cart Items
 */
exports.updateCartItems = function(req, res) {
    Account
        .findOne({
		    _id: req.user._account,
        }).exec(function(err, account) {
            if (err) {
                return res.status(500).json({
                    error: 'Cannot update cart'
                });
            }
            var simpleSplit = req.params.productSimple.split('-');
            if (account.name === simpleSplit[0] && simpleSplit.length===3) {
				    
                Purchasable
                    .findOne({
                        name: req.params.purchasableName,
        			    buyer: account.name
                    })
                    .exec(function(err, purchasable) {
                        if (err) return err;
                        if (!purchasable) return new Error('Failed to load Purchasable ' + name);
							
						req.body.cart_items.forEach(function (cart_item) {
   			                for (var i in purchasable.cart_item) {
							    if (purchasable.cart_item[i]._simple === cart_item.simple){
				    		        if (cart_item.quantity === 0) {
								        purchasable.cart_item.splice(i, 1);
								    } else { 
								        purchasable.cart_item[i].quantity = cart_item.quantity;
								    }
                                }
				            }
				        });
							
			            purchasable.save(function(err) {
                            if (err) {
                                return res.send('users/signup', {
                                    errors: err.errors,
                                    purchasable: purchasable
                                });
                            } else {
                                return res.jsonp(purchasable.cart_item);
                            }
                        });
                    });
            }
        });
};

function calculateCartRuleSum(purchasable, rule, totals, total, total_quantity, callback){
                                
    var ruleSplit = rule.split(' ');
    var ruleType = ruleSplit[0];
    var sum = 0;
    var subsum = 0;
    var sub_quantity = 0;
    var targetSplit = ruleSplit[1].split(':');
    var target, target_value, threshold, discount;
    switch (ruleType) {
        case 'sum':
            target = targetSplit[0];
            target_value = targetSplit[1];
            threshold = ruleSplit[3];
            discount = ruleSplit[5];
            var i, ii;
                                    
            switch (target) {
                case 'cart':
                    if (total > threshold) {
                        if (discount.indexOf('%')) {
                            sum -= Math.round(total*parseFloat(discount)/100);
                        } else {
                            sum -= total-parseFloat(discount);
                        }
                    }
                    break;
                                                                       
                case 'category':
                    for (i in purchasable.purchasable_products) {
                        if (purchasable.purchasable_products[i].category === target_value) {
                            for (ii in totals.subtotals) {
                                if (totals.subtotals[ii].simple === purchasable.purchasable_products[i].simple) {
                                    subsum += totals.subtotals[ii].sum;
                                }
                            }
                        }    
                    }
                                                
                    if (subsum > threshold) {
                        if (discount.indexOf('%')) {
                            sum -= subsum * parseFloat(discount) / 100;
                        } else {
                            sum -= subsum - parseFloat(discount);
                        }
                        sum = Math.round(sum);
                    }
                    break;
                                                
                case 'sku':
                    for (ii in totals.subtotals ) {
                        if (totals.subtotals[ii].simple.indexOf(target_value) === 0) {
                            subsum += totals.subtotals[ii].sum;
                        }
                    }
                                                
                    if (subsum > threshold) {
                        if (discount.indexOf('%')) {
                            sum -= subsum * parseFloat(discount) / 100;
                        } else {
                            sum -= subsum - parseFloat(discount);
                        }
                        sum = Math.round(sum);
                    }
                    break;
                                                
                case 'simple':
                    for (ii in totals.subtotals) {
                        if (totals.subtotals[ii].simple === target_value) {
                            subsum += totals.subtotals[ii].sum;
                        }
                    }
                    
                    if (subsum > threshold) {
                        if (discount.indexOf('%')) {
                            sum -= subsum * parseFloat(discount) / 100;
                        } else {
                            sum -= subsum - parseFloat(discount);
                        }
                        sum = Math.round(sum);
                    }
                    break;
            }
            break;
                                        
        case 'quantity':
            target = targetSplit[0];
            target_value = targetSplit[1];
            threshold = ruleSplit[3];
            discount = ruleSplit[5];
                                        
            switch (target) {
                case 'cart':
                    if (total_quantity > threshold) {
                        if (discount.indexOf('%')) {
                            sum -= Math.round(total*parseFloat(discount)/100);
                        } else {
                            sum -= total-parseFloat(discount);
                        }
                    }
                    break;
                                                                           
                case 'category':
                    for (i in purchasable.purchasable_products) {
                        if (purchasable.purchasable_products[i].category === target_value) {
                            for (ii in totals.subtotals) {
                                if (totals.subtotals[ii].simple === purchasable.purchasable_products[i].simple) {
                                    subsum += totals.subtotals[ii].sum;
                                    sub_quantity += totals.subtotals[ii].quantity;
                                }
                            }
                        }    
                    }
                                                
                    if (sub_quantity > threshold) {
                        if (discount.indexOf('%')) {
                            sum -= subsum * parseFloat(discount) / 100;
                        } else {
                            sum -= subsum - parseFloat(discount);
                        }
                        sum = Math.round(sum);
                    }
                    break;
                                            
                case 'sku':
                    for (ii in totals.subtotals) {
                        if (totals.subtotals[ii].simple.indexOf(target_value) === 0) {
                            subsum += totals.subtotals[ii].sum;
                            sub_quantity += totals.subtotals[ii].quantity;
                        }
                    }
                                            
                    if (sub_quantity > threshold) {
                        if (discount.indexOf('%')) {
                            sum -= subsum * parseFloat(discount) / 100;
                        } else {
                            sum -= subsum - parseFloat(discount);
                        }
                        sum = Math.round(sum);
                    }
                    break;
                                                
                case 'simple':
                    for (ii in totals.subtotals) {
                        if (totals.subtotals[ii].simple === target_value) {
                            subsum += totals.subtotals[ii].sum;
                            sub_quantity += totals.subtotals[ii].quantity;
                        }
                    }
                                            
                    if (sub_quantity > threshold) {
                        if (discount.indexOf('%')) {
                            sum -= subsum * parseFloat(discount) / 100;
                        } else {
                            sum -= subsum - parseFloat(discount);
                        }
                        sum = Math.round(sum);
                    }
                    break;
            }
            break;       
    }
                                
    callback(sum);
}

function calculateCartItemSum (purchasable, cart_item, callback){
    for (var i in purchasable.purchasable_products) {
        if (purchasable.purchasable_products[i]._simple === cart_item._simple) {
            var sum = purchasable.purchasable_products[i].agreed_price + cart_item.quantity;
            
            return callback(sum);
        }
    }
    return callback(0);
}

function calculateSum(err, purchasable, res) {
    if (err) return err;
    if (!purchasable) return new Error('Failed to load Purchasable ' + name);
                            
    var totals;
    var total = 0;
    var total_quantity = 0;
                            
    //purchasable.cart_items.forEach(calculateCartItemSum);
    
    function asyncCartItems(cart_item) {
        if (cart_item) {
            calculateCartItemSum(purchasable, cart_item, function(sum) {
                if (sum !== 0) {
                    totals.subtotals.push({
                        simple: cart_item._simple,
                        quantity: cart_item.quantity,
                        sum: sum
                    });
                    
                    total += sum;
                    total_quantity += cart_item.quantity;
                }
                
                return asyncCartItems(purchasable.cart_items.shift());
            });    
        } else {
            asyncCartRules(purchasable.cart_rules.shift());
        }
    }
    asyncCartItems(purchasable.cart_items.shift());
                            
    var ruleSum = 0;
	purchasable.rules.forEach(calculateCartRuleSum);
    
    function asyncCartRules(rule) {
        if (rule) {
            calculateCartRuleSum(purchasable, rule, totals, total, total_quantity, function(sum) {
                if (sum !== 0) {
                    totals.cart_rules.push({
                        rule: rule,
                        sum: sum
                    });
                    
                    ruleSum += sum;
                }
                
                return asyncCartRules(purchasable.cart_rules.shift());
            });
            
        } else {
            totals.total = total + ruleSum;
	        res.jsonp(totals);
        }
    }
}


/**
 * Sum Cart
 */
exports.sumCart = function(req, res) {
    Account
        .findOne({
		    _id: req.user._account,
        }).exec(function(err, account) {
            if (err) {
                return res.status(500).json({
                    error: 'Cannot get cart sum'
                });
            }
            var simpleSplit = req.params.productSimple.split('-');
            if (account.name === simpleSplit[0] && simpleSplit.length===3) {
				    
                Purchasable
                    .findOne({
                        name: req.params.purchasableName,
                        buyer: account.name
                    })
                    .exec(function (err, purchasable) {
                        calculateSum(err, purchasable, res);
                    });
            }
        });
    
};