'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Product Schema
 */
var ProductSchema = new Schema({	
    _account: {
        type: Schema.ObjectId,
        ref: 'Account'
    },
    simple: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    currency: String,
    original_price: Number,
    special_price: Number,
    price: Number,
    description: {
        type: String,
        default: '',
        trim: true
    },
    is_show_price: {
        type: Boolean,
        default: false,
        trim: true
    },
    is_discoverable: {
        type: Boolean,
        default: false,
        trim: true
    },
    custom_fields: {
    	  name: String,
    	  value: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});

/**
 * Validations
 */
ProductSchema.path('simple').validate(function(simple) {
    return !!simple;
}, 'Simple cannot be blank');

ProductSchema.path('name').validate(function(name) {
    return !!name;
}, 'Name cannot be blank');

ProductSchema.path('category').validate(function(category) {
    return !!category;
}, 'Category cannot be blank');


/**
 * Statics
 */
ProductSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('_account', 'name').exec(cb);
};

mongoose.model('Product', ProductSchema);
