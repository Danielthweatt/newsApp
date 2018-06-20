// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const router = require("./controllers/controller.js");
const mongoose = require("mongoose");

// Express App Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Router
app.use(router);

// Server Start
app.listen(PORT, function(){
    console.log("App now listening at localhost:" + PORT);
});