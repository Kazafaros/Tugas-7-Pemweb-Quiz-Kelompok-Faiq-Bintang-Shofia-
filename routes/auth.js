const express = require('express');
const bcrypt = require('bcrypt'); // Untuk hashing password
const db = require('../db'); // Import koneksi database
const router = express.Router();

// Menampilkan halaman registrasi
router.get('/registrasi', (req, res) => {
    res.render('registrasi');
});

// Menangani registrasi pengguna baru
router.post('/registrasi', (req, res) => {
    const { username, password } = req.body;
    // Hash password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err, result) => {
            if (err) {
                return res.status(500).send('Error registering user.');
            }
            res.redirect('/auth/login');
        });
    });
});
router.get('/index', (req, res) => {
    res.render('index');
})
// Menampilkan halaman login
router.get('/login', (req, res) => {
    res.render('login');
});

// Menangani login pengguna
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const user = results[0];
            // Membandingkan password yang di-hash
            bcrypt.compare(password, user.password, (err, match) => {
                if (err) throw err;
                if (match) {
                    // Jika password cocok, buat sesi pengguna
                    req.session.user = {
                        id: user.id,
                        username: user.username
                    };
                    return res.redirect('/posts'); // Redirect ke halaman postingan
                } else {
                    return res.status(401).send('Invalid credentials.');
                }
            });
        } else {
            return res.status(401).send('Invalid credentials.');
        }
    });
});

// Menangani logout pengguna
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/auth/login');
    });
});

module.exports = router;
