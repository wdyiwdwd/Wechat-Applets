var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var TestSchema = new Schema({
  name: { type: String},
});

mongoose.model('Test', TestSchema);