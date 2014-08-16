'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Account = mongoose.model('Account'),
    User = mongoose.model('User'),
    _ = require('lodash');

/**
 * Find account by name
 */
exports.account = function(req, res, next, name) {
    Account
        .findOne({
            name: name
        })
        .exec(function(err, account) {
            if (err) return next(err);
            if (!account) return next(new Error('Failed to load Account ' + name));
            req.account = account;
            next();
        });
};

/**
 * Create account
 */
exports.create = function(req, res, next) {
    console.log('[accounts.create]');
	  var account_fields = {
	  	  name: req.body.name,
	  	  phone: req.body.phone,
	  	  email: req.body.email,
	  	  status: 2
	  };
	  
	  var user_fields = {
	  	  name: 'Admin',
	  	  username: req.body.username+'_admin',
	  	  password: req.body.password,
	  	  email: req.body.email
	  };
	  
    var account = new Account(account_fields);
    var user = new User(user_fields);

    //user.provider = 'local';

    // because we set our user.provider to local our models/user.js validation will always be true
    req.assert('email', 'You must enter a valid email address').isEmail();
    req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
    req.assert('username', 'Username cannot be more than 20 characters').len(1,20);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }

    // Hard coded for now. Will address this with the user permissions system in v0.3.5
    //user.roles = ['authenticated'];
    account.save(function(err) {
        if (err) {
        	  console.log('[account err]' + err);
            switch (err.code) {
                case 11000:
                case 11001:
                    res.status(400).send('Username already taken');
                    break;
                default:
                    res.status(400).send('Please fill all the required fields');
            }

            return res.status(400);
        }
        user._account = account;
        
        //req.logIn(user, function(err) {
        //    if (err) return next(err);
        //    return res.redirect('/');
        //});
        //res.status(200);
        user.save(function(err) {
            if (err) {
            	  console.log('[user err]' + err);
                switch (err.code) {
                    case 11000:
                    case 11001:
                        res.status(400).send('Username already taken');
                        break;
                    default:
                        res.status(400).send('Please fill all the required fields');
                }

                return res.status(400);
            }
            req.logIn(user, function(err) {
                if (err) return next(err);
                return res.redirect('/');
            });
            res.status(200);
        });
    });
};

/**
 * Update an account
 */
exports.update = function(req, res) {
	
    var account_fields = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        status: req.body.status
    };
	  
    var user_fields = {
        name: 'Admin',
	  	username: req.body.username+'_admin',
        password: req.body.password,
        email: req.body.email
    };
	  
    var account = req._account;
    var user = req.user;
    console.log('account1--'+account);
    account = _.extend(account, account_fields);
    console.log('account2--'+account);
    user = _.extend(user, user_fields);
    
    account.save(function(err) {
        if (err) {
            return res.status(400);
        } else {
            user.save(function(err) {
                if (err) {
                    return res.status(400);
                } else {
                    res.jsonp(account);
                }
            });
        }
    });
};

/**
 * Send Account
 */
exports.me = function(req, res) {
    
    console.log('[user]'+req.user);
    console.log('[account]'+req.user._account);
    //console.log('[_account]'+req.user.account);
    console.log('[name]'+req.user.name);
    Account
        .findOne({
            _id: req.user._account
        })
        .exec(function(err, account) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(account);
            }
        });
};
