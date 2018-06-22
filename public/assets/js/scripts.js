$(function(){
    // Variables
    let canClick;
    const informativeHeader = $("#informative-header");
    const articleList = $("#article-list");

    // Function Declarations
    function scrape(initialScrape){
        if (canClick || initialScrape) {
            informativeHeader.empty();
            canClick = false;
            articleList.empty();
            articleList.append(`<li class="list-group-item text-center">Scraping Deadspin...</li>`);
            $.getJSON("/scrape", function(articles){
                articleList.empty();
                informativeHeader.text("Current (Scraped) Homepage Articles:");
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
            informativeHeader.empty();
            canClick = false;
            articleList.empty();
            articleList.append(`<li class="list-group-item text-center">Accessing Database...</li>`);
            $.getJSON("/articles", function(articles){
                articleList.empty();
                informativeHeader.text("Articles In Database:");
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
                    articleList.append(`<li class="list-group-item text-center">Unable to retrieve articles.</li>`);
                }
                canClick = true;
            });
        }
    };

    function getCommentedArticles(){
        if (canClick){
            informativeHeader.empty();
            canClick = false;
            articleList.empty();
            articleList.append(`<li class="list-group-item text-center">Accessing Database...</li>`);
            $.getJSON("/articles/commented", function(articles){
                articleList.empty();
                informativeHeader.text("Articles With Comments:");
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
                    articleList.append(`<li class="list-group-item text-center">Unable to retrieve any articles.</li>`);
                }
                canClick = true;
            });
        }
    };

    function comment(button){
        if (canClick) {
            canClick = false;
            const link = button.attr("data-link");
            $.getJSON(`/article/${link}`, function(articles){
                alert("Yay! It worked!");
            });
            canClick = true;
        }
    };

    // Event Listeners
    $("#all-articles").click(function(){
        getArticles();
    });
    
    $("#commented-articles").click(function(){
        getCommentedArticles();
    });

    $("#re-scrape").click(function(){
        scrape(false);
    });

    $(document).on("click", ".commentButton", function() {
        comment($(this));
    });
    // Function Calls
    scrape(true);
});