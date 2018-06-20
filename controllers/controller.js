// Dependencies
const express = require("express");

// Router Setup
const router = express.Router();

// Routes
router.get("/", function(req, res){
    const hbsObject = {
        articles: ["Article One", "Article Two", "Article Three"]
    };
    res.render("index", hbsObject);
});



// Export
module.exports = router;