// Dependencies
const express = require("express");
const request = require("request");
const cheerio = require("cheerio");

// Router Setup
const router = express.Router();

// Routes
router.get("/", function(req, res){
    request("https://www.deadspin.com/", function(error, response, html){
        const $ = cheerio.load(html);
        const results = [];
        let link;
        let title;
        let headlineElement;
        let summary;
        $("div.post-wrapper").each(function(i, element){
            headlineElement = $("h1.headline", element);
            link = headlineElement.children().attr("href");
            title = headlineElement.children().text();
            summary = $("div.entry-summary", element).children().text();
            if (title) {
                results.push({
                    title: title,
                    link: link,
                    summary: summary
                });
            }
        });
        const hbsObject = {
            articles: results
        };
        res.render("index", hbsObject);
    });
});

// Export
module.exports = router;