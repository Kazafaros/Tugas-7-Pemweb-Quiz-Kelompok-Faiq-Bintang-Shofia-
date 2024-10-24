const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts'); 
const path = require('path');

const app = express();

// Set EJS sebagai Template Engine
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));


app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    if (!req.session.user && req.path != '/auth/login' && req.path != '/auth/registrasi' && req.path != '/auth/index') {
        
        return res.redirect('/auth/index');
    }
    next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes); // Use post routes


app.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/posts');
    } else {
        return res.redirect('/auth/login');
    }
});

// Menjalankan Server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
