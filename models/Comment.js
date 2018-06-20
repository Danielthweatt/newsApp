// Dependencies
const mongoose = require("mongoose");

// Schema Constructor
const Schema = mongoose.Schema;

// Comment Schema
const CommentSchema = new Schema({
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

// Comment Model Creation
const CommentModel = mongoose.model("Comment", CommentSchema);

// Export Model
module.exports = CommentModel;