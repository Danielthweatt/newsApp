// Dependencies
const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const db = require("../models");

// Router Setup
const router = express.Router();

// Routes
router.get("/", function(req, res){
    request("https://www.deadspin.com/", function(error, response, html){
        const $ = cheerio.load(html);
        const results = [];
        let headlineElement;
        $("div.post-wrapper").each(function(i, element){
            const result = {};
            headlineElement = $("h1.headline", element);
            result.link = headlineElement.children().attr("href");
            result.title = headlineElement.children().text();
            result.summary = $("div.entry-summary", element).children().text();
            if (result.title) {
                db.Article.findOne({link: result.link}).then(function(article){
                    if (!article) {
                        db.Article.create(result).then(function(dbArticle){
                            console.log(dbArticle);
                        }).catch(function(err){
                            console.log(`Oh boy, it broke: ${err}`);
                        });
                    }
                }).catch(function(err){
                    console.log(`Oh boy, it broke: ${err}`);
                });
                results.push(result);
            }
        });
        const hbsObject = {
            articles: results
        };
        res.render("index", hbsObject);
    });
});

router.get("/scrape", function(req, res){
    request("https://www.deadspin.com/", function(error, response, html){
        const $ = cheerio.load(html);
        const results = [];
        let headlineElement;
        $("div.post-wrapper").each(function(i, element){
            const result = {};
            headlineElement = $("h1.headline", element);
            result.link = headlineElement.children().attr("href");
            result.title = headlineElement.children().text();
            result.summary = $("div.entry-summary", element).children().text();
            if (result.title) {
                db.Article.findOne({link: result.link}).then(function(article){
                    if (!article) {
                        db.Article.create(result).then(function(dbArticle){
                            console.log(dbArticle);
                        }).catch(function(err){
                            console.log(`Oh boy, it broke: ${err}`);
                        });
                    }
                }).catch(function(err){
                    console.log(`Oh boy, it broke: ${err}`);
                });
                results.push(result);
            }
        });
        const resultObject = {
            articles: results
        };
        res.json(resultObject);
    });
});

// Export
module.exports = router;