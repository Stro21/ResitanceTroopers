'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({

    username: {type: String, trim: true, required: true},
    password: {type: String, trim: true, required: true},
    role: {type: String, trim: true, required: true}

});

module.exports = mongoose.model('User', userSchema);
