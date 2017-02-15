var mongoose = require('mongoose');

var aboutSchema = new mongoose.Schema({
    title: {type: String, required: true},
    contents: {type: String, required: true},
    fileName: {type: String, required: true}
});

module.exports = mongoose.model('About', aboutSchema);