$(function(){
    // Variables
    const articleList = $("#article-list");

    // Function Declarations
    function reScrape(){
        articleList.empty();
        articleList.append(`<li class="list-group-item text-center">Scraping Deadspin...</li>`);
        $.getJSON("/scrape", function(articles){
            articleList.empty();
            if (articles) {
                articles.articles.forEach(function(article){
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
        });
    };

    // Event Listeners
    $("#re-scrape").click(function(){
        reScrape();
    })
});