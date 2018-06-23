$(function(){
    // Variables
    let canClick;
    const informativeHeader = $("#informative-header");
    const articleList = $("#article-list");
    const commentModal = $("#comment-modal");
    const modalTitle = $("#modal-title");
    const commentAuthor = $("#comment-author");
    const commentBody = $("#comment-body");
    const submitCommentForm = $("#submit-comment-form");
    const commentList = $("#comment-list");

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

    function seeComments(button){
        if (canClick) {
            canClick = false;
            const id = button.attr("data-id");
            $.getJSON(`/article/${id}`, function(article){
                if (article.length > 0) {
                    modalTitle.text(article[0].title);
                    submitCommentForm.attr("data-id", article[0]._id);
                    if (article[0].comments.length > 0) {
                        article[0].comments.forEach(function(savedComment){
                            commentList.append(
                                `<li id=${savedComment._id} class="list-group-item">
                                    <h6>${savedComment.author}:</h6>
                                    <p>${savedComment.body}</p>
                                    <button type="button" class="btn btn-outline-danger commentDeleteButton" data-commentId=${savedComment._id}>
                                        Delete
                                    </button>
                                </li>`
                            );
                        });
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
        if (comment.author !== "" && comment.body !== "") {
            $.ajax({
                method: "POST",
                url: "/article-comment/" + articleId,
                data: comment
            }).then(function(response){
                commentModal.modal("hide");
            }).fail(function(){
                commentAuthor.val("Sorry!");
                commentBody.val("An error occured while trying to save you comment. Please try again.");
            });
        } else {
            if (comment.author === "") {
                commentAuthor.val("You must enter an author to submit a comment.");
            } 
            if (comment.body === "") {
                commentBody.val("You must enter a comment to submit.");
            }
        }
    };

    function deleteComment(button){
        const articleId = submitCommentForm.attr("data-id");;
        const commentId = button.attr("data-commentId");
        const article = {
            _id: articleId 
        };
        $.ajax({
            method: "DELETE",
            url: "/comment/" + commentId,
            data: article
        }).then(function(response){
            $(`#${commentId}`).remove();
        }).fail(function(){
            console.log("An error occured while attempting deletion.");
        });
    };

    function refreshModal(){
        canClick = true;
        modalTitle.text("");
        submitCommentForm.attr("data-id", "");
        commentAuthor.val("");
        commentBody.val("");
        commentList.empty();
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
        seeComments($(this));
    });

    submitCommentForm.on("submit", function(event){
        event.preventDefault();
        submitComment();
    });

    $(document).on("click", ".commentDeleteButton", function() {
        deleteComment($(this));
    });

    commentModal.on("hidden.bs.modal", function(){
        refreshModal();
    });

    // Function Calls
    scrape(true);
});