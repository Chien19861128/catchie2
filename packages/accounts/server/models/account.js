'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Validations
 */
var validateUniqueEmail = function(value, callback) {
    var User = mongoose.model('Account');
    User.find({
        $and: [{
            email: value
        }, {
            _id: {
                $ne: this._id
            }
        }]
    }, function(err, user) {
        callback(err || user.length === 0);
    });
};

/**
 * Account Schema
 */
var PartnerSchema = new Schema({
    _account: {
        type: Schema.ObjectId,
        ref: 'Account'
    },
    status: Number,
    created: {
        type: Date,
        default: Date.now
    }
});

var AccountSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email'],
        validate: [validateUniqueEmail, 'E-mail address is already in-use']
    },
    address: String,
    website: String,
    status: Number,
    user_groups: [{ name: String, permissions: String, user_ids: String }],
    settings: String,
	partners: [PartnerSchema],
    created: {
        type: Date,
        default: Date.now
    }
});

/**
 * Validations
 */
AccountSchema.path('name').validate(function(name) {
    return !!name;
}, 'Name cannot be blank');

AccountSchema.path('phone').validate(function(phone) {
    return !!phone;
}, 'Phone cannot be blank');

AccountSchema.path('email').validate(function(email) {
    return !!email;
}, 'Email cannot be blank');

mongoose.model('Account', AccountSchema);