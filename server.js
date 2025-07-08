const express = require('express');
const path = require('path');
const app = express(); // ← this must come BEFORE you use `app`

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static('public'));

// Define routes
app.get('/', (req, res) => res.render('pages/index'));
app.get('/about', (req, res) => res.render('pages/about'));
app.get('/active-house', (req, res) => res.render('pages/active-house'));
app.get('/alumni', (req, res) => res.render('pages/alumni'));
app.get('/rush', (req, res) => res.render('pages/rush'));
app.get('/contact', (req, res) => res.render('pages/contact'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
