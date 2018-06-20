// Dependencies
const express = require("express");

// Router Setup
const router = express.Router();

// Routes
router.get("/", function(req, res){
    res.render("index");
});



// Export
module.exports = router;