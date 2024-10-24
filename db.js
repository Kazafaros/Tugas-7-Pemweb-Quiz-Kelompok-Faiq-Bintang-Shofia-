const mysql = require('mysql2');

// Membuat koneksi ke database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Ganti dengan username MySQL Anda
    password: '', // Ganti dengan password MySQL Anda
    database: 'blog_cms' // Ganti dengan nama database yang telah Anda buat
});

// Menghubungkan ke database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

module.exports = db;
