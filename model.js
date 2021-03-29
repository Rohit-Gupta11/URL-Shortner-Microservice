const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    original_url : String,
    short_url : String
});

var UrlModel = mongoose.model("UrlModel", urlSchema);

exports.UrlModel = UrlModel;