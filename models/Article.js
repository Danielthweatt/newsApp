// Dependencies
const mongoose = require("mongoose");

// Schema Constructor
const Schema = mongoose.Schema;

// Article Schema
const ArticleSchema = new Schema({
    title: String,
    link: {
        type: String,
        unique: true
    },
    summary: String,
    commentedOn: {
        type: Boolean,
        default: false
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

// Article Model Creation
const ArticleModel = mongoose.model("Article", ArticleSchema);

// Export Model
module.exports = ArticleModel;