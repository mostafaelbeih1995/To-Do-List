const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
    name: String
});

module.exports = mongoose.model('Item', itemSchema);