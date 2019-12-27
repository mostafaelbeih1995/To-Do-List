const mongoose = require("mongoose");
const Item = require("./models/item");

const listSchema = mongoose.Schema({
    name: String,
    items: [Item]
});

module.exports = mongoose.model('List', listSchema);