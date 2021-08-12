import sqlite3
import click

from flask import current_app, g
from flask.cli import with_appcontext
from werkzeug.security import check_password_hash, generate_password_hash


def get_db():
    if 'conn' not in g:
        g.conn = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.conn.row_factory = sqlite3.Row

    return g.conn


def close_db(e=None):
    conn = g.pop('conn', None)

    if conn is not None:
        conn.close()


def init_db():
    conn = get_db()

    with current_app.open_resource('schema.sql') as f:
        conn.executescript(f.read().decode('utf8'))


@click.command('init-db')
@with_appcontext
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)


def get_user(username, conn):
    with conn:
        return conn.execute('SELECT * FROM user WHERE username LIKE ?', (username,)).fetchone()


def get_user_by_id(user_id, conn):
    with conn:
        return conn.execute('SELECT * FROM user WHERE id = ?', (user_id,)).fetchone()


def create_user(username, password, conn):
    with conn:
        try:
            conn.execute('INSERT INTO user (username, password) VALUES (?, ?)',
            (username, generate_password_hash(password)))
            return 'successful'
        except sqlite3.Error as e:
            return repr(e)


def get_all_posts(conn):
    with conn:
        return conn.execute(
        """SELECT p.id, title, body, created, author_id, username
           FROM post p JOIN user u ON p.author_id = u.id
           ORDER BY created DESC """).fetchall()


def add_post(conn,title, body):
    with conn:
        try:
            conn.execute('INSERT INTO post (title, body, author_id) VALUES (?, ?, ?)', (title, body, g.user['id']))
            return "successful"
        except sqlite3.Error as e:
            return repr(e)


def get_post_by_post_id(conn, id):
    with conn:
        return conn.execute(
        """ SELECT p.id, title, body, created, author_id, username
            FROM post p JOIN user u ON p.author_id = u.id
            WHERE p.id = ? """, (id,)).fetchone()


def update_post(conn, title, body, id):
    with conn:
        try:
            conn.execute(""" UPDATE post SET title = ?, body = ? WHERE id = ? """, (title, body, id)) 
            return "successful"
        except sqlite3.Error as e:
            return repr(e)


def delete_post(conn, id):
    with conn:
        try:
            conn.execute('DELETE FROM post WHERE id = ?', (id,))
            return 'successful'
        except sqlite3.Error as e:
            return repr(e)

