// Dependencies
const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const db = require("../models");

// Router Setup
const router = express.Router();

// Helper
function saveArticlesToDb(results, articles, result, res){
    if (results.length > 0) {
        result = results.pop();
        db.Article.findOne({link: result.link}).then(function(article){
            if (!article) {
                db.Article.create(result).then(function(newArticle){
                    result.id = newArticle._id;
                    articles.unshift(result);
                    saveArticlesToDb(results, articles, result, res);
                }).catch(function(err){
                    console.log(`Oh boy, it broke: ${err}`);
                    res.json([]);
                });
            } else {
                result.id = article._id;
                articles.unshift(result);
                saveArticlesToDb(results, articles, result, res);
            }
        }).catch(function(err){
            console.log(`Oh boy, it broke: ${err}`);
            res.json([]);
        });
    } else {
        res.json(articles);
    }
};

// Routes
router.get("/", function(req, res){
    res.render("index");
});

router.get("/articles", function(req, res){
    db.Article.find({}).sort({dateCreated: -1}).then(function(articles){
        res.json(articles);
    }).catch(function(err){
        console.log(`Oh boy, it broke: ${err}`);
        res.json([]);
    });
});

router.get("/articles/commented", function(req, res){
    db.Article.find({commentedOn: true}).sort({dateCreated: -1}).then(function(articles){
        res.json(articles);
    }).catch(function(err){
        console.log(`Oh boy, it broke: ${err}`);
        res.json([]);
    });
});

router.get("/article/:id", function(req, res){
    db.Article.findOne({_id: req.params.id}).populate("comments").then(function(article){
        res.json([article]);
    }).catch(function(err){
        console.log(`Oh boy, it broke: ${err}`);
        res.json([]);
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
            if (result.title && result.link) {
                results.push(result);
            }
        });
        saveArticlesToDb(results, [], undefined, res);
    });
});

router.post("/article-comment/:articleId", function(req, res){
    db.Comment.create(req.body).then(function(newComment){
        return db.Article.findOneAndUpdate({
            _id: req.params.articleId
        }, {
            $push: {comments: newComment._id}, 
            commentedOn: true
        }, {
            new: true
        });
    }).then(function(article){
        res.status(200).end();
    }).catch(function(err){
        console.log(`Oh boy, it broke: ${err}`);
        res.status(500).end();
    });
});

router.delete("/comment/:id", function(req, res){
    db.Comment.findOneAndDelete({_id: req.params.id}).then(function(comment){
        commentId = comment._id;
        return db.Article.findOneAndUpdate({
            _id: req.body
        }, { 
            $pull: {comments: commentId} 
        }, {
            new: true
        });
    }).then(function(article){
        if (article.comments.length < 1) {
            return db.Article.findOneAndUpdate({
                _id: req.body
            }, {
                commentedOn: false
            });
        } else {
            res.status(200).end();
        }
    }).then(function(article){
        res.status(200).end();
    }).catch(function(err){
        console.log(`Oh boy, it broke: ${err}`);
        res.status(500).end();
    });
});

// Export
module.exports = router;