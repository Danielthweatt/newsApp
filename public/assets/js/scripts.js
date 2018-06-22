$(function(){
    // Variables
    let canClick;
    const articleList = $("#article-list");

    // Function Declarations
    function scrape(initialScrape){
        if (canClick || initialScrape) {
            canClick = false;
            articleList.empty();
            articleList.append(`<li class="list-group-item text-center">Scraping Deadspin...</li>`);
            $.getJSON("/scrape", function(articles){
                articleList.empty();
                if (articles.length > 0) {
                    articles.forEach(function(article){
                        articleList.append(
                            `<li class="list-group-item text-center">
                                <h6><a href=${article.link} class="text-center">${article.title}</a></h6>
                                <p class="text-center">${article.summary}</p>
                                <button type="button" class="btn btn-outline-danger commentButton" data-link=${article.link}>
                                    Comment
                                </button>
                            </li>`
                        );
                    });
                } else {
                    articleList.append(`<li class="list-group-item text-center">Unable to display articles.</li>`);
                }
                canClick = true;
            });
        }
    };

    function getArticles(){
        if (canClick){
            canClick = false;
            articleList.empty();
            articleList.append(`<li class="list-group-item text-center">Accessing Database...</li>`);
            $.getJSON("/articles", function(articles){
                articleList.empty();
                if (articles.length > 0) {
                    articles.forEach(function(article){
                        articleList.append(
                            `<li class="list-group-item text-center">
                                <h6><a href=${article.link} class="text-center">${article.title}</a></h6>
                                <button type="button" class="btn btn-outline-danger commentButton" data-link=${article.link}>
                                    Comment
                                </button>
                            </li>`
                        );
                    });
                } else {
                    articleList.append(`<li class="list-group-item text-center">Unable to display articles.</li>`);
                }
                canClick = true;
            });
        }
    };

    // Event Listeners
    $("#re-scrape").click(function(){
        scrape(false);
    });

    $("#all-articles").click(function(){
        getArticles();
    });

    // Function Calls
    scrape(true);
});