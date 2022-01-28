class FetchData {
    static async controller(url, method = 'GET', obj) {
        let options = {
            method: method,
            headers: {
                'content-type': 'application/json; charset=UTF-8',
            }
        };
        if (obj)
            options.body = JSON.stringify(obj)

        let request = await fetch(url, options)
        if (request.ok) {
            return request.json()
        } else {
            throw request.status;
        }
    }
}

class Post {
    constructor(postNumber, postForm) {
        this.postNumber = postNumber
        this.postForm = postForm
        this.postApi = 'https://jsonplaceholder.typicode.com/posts/'
        this.commentApi = 'https://jsonplaceholder.typicode.com/comments?postId='
        this.postForm.addEventListener('submit', async e => {
            e.preventDefault()
            this.addComment()
            this.postForm.reset()
        })
    }

    get title() {
        return this.postTitle
    }

    set title(title) {
        this.postTitle = title
    }

    get postText() {
        return this.text
    }

    set postText(text) {
        this.text = text
    }

    get comments() {
        return this.postComments
    }

    set comments(comments) {
        this.postComments = comments
    }

    async printPost() {
        try {
            let post = await FetchData.controller(this.postApi + this.postNumber);
            this.postText = post.body
            this.title = post.title
            this.comments = await FetchData.controller(this.commentApi + this.postNumber)
            this.render()
        } catch (err) {
            console.error(err)
        }
    }

    render() {
        this.postForm.innerHTML = ` <div class="post post-border">${this.getOptions()}</div>`
    }

    getOptions() {
        return [this.postTextRender(), this.commentsRender(), this.CommentFormRender()].join("")
    }

    postTextRender() {
        return `
            <h1 class="post__title post-border">${this.title}</h1>
            <div class="post__description post-border">${this.postText}</div>`
    }

    commentsRender() {
        let allComments = this.comments.map(comment => {
            return `
            <ul class="post-comments__list">
                <li class="post-comments__list-item"><strong>Title: ${comment.name}</strong></li>
                <li class="post-comments__list-item"><strong>Email:</strong> ${comment.email}</li>
                <li class="post-comments__list-item">${comment.body}</li>
            </ul>`
        })

        return `
                <div id="postComments" class="post-comments post-border">
                    <h3 class="post-comments__title">List of comments</h3>
                    ${allComments.join("")}
                </div>
            `
    }

    CommentFormRender() {
        return `
            <div class="comment-form post-border">
                <div class="comment-form__group">
                  <label class="comment-form__label">Email
                    <input id="inputEmail" class="comment-form__input" required>
                  </label>
                </div>
                <div class="comment-form__group">
                  <label class="comment-form__label">Title
                    <input id="inputTitle" class="comment-form__input input-title" required>
                  </label>
                </div>
                <div class="comment-form__group">
                  <label class="comment-form__label">Your comment
                    <input id="inputText" class="comment-form__input" required>
                  </label>
                </div>
            </div>
        <button class="form-submit post-border" id="formSubmit" type="submit">Add Comment</button>
             `
    }

    newPostRender(comment) {
        let postList = document.createElement('ul');
        postList.classList.add("post-comments__list")
        postList.innerHTML =
            `<li class = "post-comments__list-item" > 
            <strong>Title: ${comment.name}</strong></li>
        <li class="post-comments__list-item">
            <strong>Email:</strong> ${comment.email}</li>
        <li class="post-comments__list-item">
            ${comment.body}</li>`

        return postList
    }

    async addComment() {
        let commentText = document.querySelector('#inputText').value
        let commentEmail = document.querySelector('#inputEmail').value
        let commentTitle = document.querySelector('#inputTitle').value
        let commentObj = {
            body: commentText,
            email: commentEmail,
            name: commentTitle
        }
        let newPostComment = await FetchData.controller(this.commentApi + this.postNumber, `POST`, commentObj);
        console.log(newPostComment);
        this.comments.push(newPostComment)
        const postComments = this.postForm.querySelector('#postComments')
        postComments.appendChild(this.newPostRender(newPostComment))
    }

}

const postForm = document.querySelector('#postForm')
const post1 = new Post(2, postForm)
post1.printPost()