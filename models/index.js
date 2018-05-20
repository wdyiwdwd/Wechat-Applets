var mongoose = require('mongoose');
var config   = require('../config');

mongoose.connect(config.db, {
  server: {poolSize: 20}
}, function (err) {
  if (err) {
     console.log('database error')
  }
});

require('./testdb')
console.log('database connection')

exports.Test = mongoose.model('Test');
