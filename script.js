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
    constructor(postNumber) {
        this.postNumber = postNumber
        this.postApi = 'https://jsonplaceholder.typicode.com/posts/'
        this.commentApi = 'https://jsonplaceholder.typicode.com/comments?postId='
        this.addComment()
    }

    get title() {
        return this.postTitle
    }

    set title(title) {
        this.postTitle = title
    }

    get body() {
        return this.postBody
    }

    set body(body) {
        this.postBody = body
    }

    get comments() {
        return this.postComments
    }

    set comments(comments) {
        this.postComments = comments
    }

    async getPost() {
        try {
            let post = await FetchData.controller(this.postApi + this.postNumber);
            this.body = post.body
            this.title = post.title
            this.comments = await FetchData.controller(this.commentApi + this.postNumber)
            this.render()
        } catch (err) {
            console.error(err)
        }
    }

    commentRender() {
        return this.comments.map(comment => {
            return `
        <ul class="comment-list">
            <li><strong>Title: ${comment.name}</strong></li>
            <li>email: ${comment.email}</li>
            <li>${comment.body}</li>
        </ul>`
        }).join("")
    }

    getCommentForm() {
        let commentForm = document.createElement('form');
        commentForm.className = "comment__form"
        commentForm.innerHTML = `
    <div>
        <label class="comment-label">
            Enter title
            <input class="comment-title" type="text" required>
        </label>
        <label class="comment-label">
            Enter email
            <input class="comment-email" type="email" required>
        </label>
        <label class="comment-label">
            Yor comment
            <input class="comment-input" type="text" required>
        </label>
    </div>
    <button class="submit-btn" id="submit" type="submit">Add Comment</button>               
`
        return commentForm
    }

    render() {
        let postWrapper = document.querySelector('#postWrapper');
        postWrapper.innerHTML =
            ` <h1 class="title">${this.title}</h1>
        <h3 class="description">${this.body}</h3>
        <div class="comments">
            <h2>List of comments</h2>
            ${this.commentRender()}
        </div>`
        postWrapper.append(this.getCommentForm())
    }

    addComment() {
        addEventListener('submit', async e => {
            e.preventDefault();
            let commentText = document.querySelector('.comment-input').value
            let commentEmail = document.querySelector('.comment-email').value
            let commentTitle = document.querySelector('.comment-title').value
            let commentObj = {
                body: commentText,
                email: commentEmail,
                title: commentTitle
            }
            let postComment = await FetchData.controller(this.commentApi + this.postNumber, `POST`, commentObj);
            this.comments.push(postComment);
            this.render()
            console.log(postComment);
        })
    }

}

const post1 = new Post(1)
post1.getPost()