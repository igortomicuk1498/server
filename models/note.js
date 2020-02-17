const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title: String,
    date: String,
    text: String,
    thumb: String
});

module.exports = mongoose.model("Note", noteSchema);