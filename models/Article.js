// Dependencies
const mongoose = require("mongoose");

// Schema Constructor
const Schema = mongoose.Schema;

// Article Schema
const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: String,
    summary: String,
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

// Article Model Creation
const ArticleModel = mongoose.model("Article", ArticleSchema);

// Export Model
module.exports = ArticleModel;