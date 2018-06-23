$(function(){
    // Variables
    let canClick;
    const informativeHeader = $("#informative-header");
    const articleList = $("#article-list");
    const commentModal = $("#commentModal");
    const modalTitle = $("#modal-title");
    const commentAuthor = $("#comment-author");
    const commentBody = $("#comment-body");
    const submitCommentForm = $("#submit-comment-form");

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
                                <button type="button" class="btn btn-outline-danger commentButton" data-id=${article.id}>
                                    Comment
                                </button>
                            </li>`
                        );
                    });
                } else {
                    articleList.append(`<li class="list-group-item text-center">Unable to display articles. Try scraping again.</li>`);
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
                                <button type="button" class="btn btn-outline-danger commentButton" data-id=${article._id}>
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
                                <button type="button" class="btn btn-outline-danger commentButton" data-id=${article._id}>
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
            const id = button.attr("data-id");
            $.getJSON(`/article/${id}`, function(article){
                console.log(article);
                if (article.length > 0) {
                    modalTitle.text(article[0].title);
                    submitCommentForm.attr("data-id", article[0]._id);
                    if (article.comment) {
                        commentAuthor.val(article[0].comment.author);
                        commentBody.val(article[0].comment.body);
                    }
                    commentModal.modal("show");
                } else {
                    canClick = true;
                }
            });
        }
    };

    function submitComment(){
        const articleId = submitCommentForm.attr("data-id");
        const comment = {
            author: commentAuthor.val().trim(),
            body: commentBody.val().trim()
        };
        $.ajax({
            method: "POST",
            url: "/comment/" + articleId,
            data: comment
        }).then(function(response){
            console.log(response);
            commentModal.modal("hide");
        });
    };

    function refreshModal(){
        canClick = true;
        modalTitle.text("");
        submitCommentForm.attr("data-id", "");
        commentAuthor.val("");
        commentBody.val("");
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

    submitCommentForm.on("submit", function(event){
        event.preventDefault();
        submitComment();
    });

    commentModal.on("hidden.bs.modal", function(){
        refreshModal();
    });

    // Function Calls
    scrape(true);
});