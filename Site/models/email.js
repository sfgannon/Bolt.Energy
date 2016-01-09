var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EmailSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Email', EmailSchema);