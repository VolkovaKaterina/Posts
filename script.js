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
        return [this.postTextRender(), this.commentsRender(), this.CommentFormRender()].join("");
    }

    getCommentText(comments) {
        return comments.map(comment => {
            return `
             <p><strong>Title: ${comment.name}</strong></p>
             <p><strong>Email:</strong> ${comment.email}</p>
             <p><strong>Comment:</strong> ${comment.body}</p>`
        })
    }

    postTextRender() {
        return `
            <h1 class="post__title post-border">${this.title}</h1>
            <div class="post__description post-border">${this.postText}</div>`
    }

    commentsRender() {
        return `
        <div class="post-comments post-border">
                <h3 class="post-comments__title">List of comments</h3>
                <ul id = "commentsList" class="post-comments__list">
                    <li class="post-comments__list-item">
                        ${this.getCommentText(this.comments)
            .join('</li><li class="post-comments__list-item">')}
                    </li>
                </ul>
         </div>`
    }

    CommentFormRender() {
        return `
        <div class="comment-form post-border">
        <div class="comment-form__group">
            <label class="comment-form__label">Email
                <input class="comment-form__input" id="inputEmail" required>
            </label>
        </div>
        <div class="comment-form__group">
            <label class="comment-form__label">Title
                <input class="comment-form__input input-title" id="inputTitle" required>
            </label>
        </div>
        <div class="comment-form__group">
            <label class="comment-form__label">Your comment
                <input class="comment-form__input" id="inputText" required>
            </label>
        </div>
    </div>
    <button class="form-submit post-border" id="formSubmit" type="submit">Add Comment</button> `
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

        const postComments = this.postForm.querySelector('#commentsList')

        const commentLi = document.createElement('li')
        commentLi.className = "post-comments__list-item";
        commentLi.innerHTML = this.getCommentText([newPostComment])

        postComments.appendChild(commentLi)
    }
}

const postForm = document.querySelector('#postForm')
const post1 = new Post(2, postForm)
post1.printPost()