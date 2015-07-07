'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MainSchema = new Schema({
  name: String,
  allowance: String,
  paid: String
});

module.exports = mongoose.model('Main', MainSchema);