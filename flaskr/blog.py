from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for
)
from werkzeug.exceptions import abort

from flaskr.auth import login_required
from flaskr.db import get_db, get_all_posts, add_post, get_post_by_post_id, update_post, delete_post

bp = Blueprint('blog', __name__)


@bp.route('/')
def index():
    conn = get_db()
    posts = get_all_posts(conn)
    return render_template('blog/index.html', posts=posts)


@bp.route('/create', methods=('GET', 'POST'))
@login_required
def create():
    if request.method == 'POST':
        title = request.form['title']
        body = request.form['body']
        error = None

        error = 'Title is required.' if not title else "Body is required." if not body else None

        if error is None:
            conn = get_db()
            outcome = add_post(conn, title, body)
            if outcome == "successful":
                return redirect(url_for('blog.index'))
            else:
                error = outcome
        
        flash(error)
        
    return render_template('blog/create.html')



def get_post(id, check_author=True):
    conn = get_db()
    post = get_post_by_post_id(conn, id)

    if post is None:
        abort(404, f"Post id {id} doesn't exist.")
        # flash(f"Post id {id} doesn't exist.")

    if check_author and post['author_id'] != g.user['id']:
        abort(403)
        # flash("unauthorised action")

    return post



@bp.route('/<int:id>/update', methods=('GET', 'POST'))
@login_required
def update(id):
    post = get_post(id)

    if request.method == 'POST':
        title = request.form['title']
        body = request.form['body']
        error = None

        error = 'Title is required.' if not title else "Body is required." if not body else None


        if error is None:
            conn = get_db()
            outcome = update_post(conn, title, body, id)
            if outcome == "successful":
                return redirect(url_for('blog.index'))
            else:
                error = outcome
        
        flash(error)

    return render_template('blog/update.html', post=post)


@bp.route('/<int:id>/delete', methods=('POST',))
@login_required
def delete(id):
    get_post(id)
    conn = get_db()
    outcome = delete_post(conn, id)
    if outcome != "successful":
        flash(outcome)

    return redirect(url_for('blog.index'))