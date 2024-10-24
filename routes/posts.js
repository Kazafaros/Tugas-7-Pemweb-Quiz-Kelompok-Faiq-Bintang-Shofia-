const express = require('express');
const db = require('../db'); // Import koneksi database
const router = express.Router();

// Menampilkan daftar postingan
router.get('/', (req, res) => {
    db.query('SELECT * FROM posts WHERE user_id = ?', [req.session.user.id], (err, results) => {
        if (err) throw err;
        res.render('posts', { posts: results });
    });
});

// Menampilkan form untuk membuat postingan baru
router.get('/create', (req, res) => {
    res.render('create-post');
});

// Menyimpan postingan baru ke database
router.post('/create', (req, res) => {
    const { title, content } = req.body;
    db.query('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)', [title, content, req.session.user.id], (err, result) => {
        if (err) throw err;
        res.redirect('/posts');
    });
});

// Menampilkan form untuk mengedit postingan
router.get('/edit/:id', (req, res) => {
    const postId = req.params.id;
    db.query('SELECT * FROM posts WHERE id = ?', [postId], (err, results) => {
        if (err) throw err;
        res.render('edit-post', { post: results[0] });
    });
});

// Mengupdate postingan
router.post('/edit/:id', (req, res) => {
    const postId = req.params.id;
    const { title, content } = req.body;
    db.query('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, postId], (err, result) => {
        if (err) throw err;
        res.redirect('/posts');
    });
});

// Menghapus postingan
router.get('/delete/:id', (req, res) => {
    const postId = req.params.id;
    db.query('DELETE FROM posts WHERE id = ?', [postId], (err, result) => {
        if (err) throw err;
        res.redirect('/posts');
    });
});

module.exports = router;
