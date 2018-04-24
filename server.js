const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/restaurants/ChIJZR1IXIiAhYARVdRHncWNWRY');
});

app.use('/restaurants/:id', express.static(path.join(__dirname, 'public')));

app.get('/api/restaurants/:id/gallery', (req, res) => {
  res.redirect(`http://localhost:2002/api/restaurants/${req.params.id}/gallery`)
});
app.get('/api/restaurants/:id/sidebar', (req, res) => {
  res.redirect(`http://localhost:2002/api/restaurants/${req.params.id}/sidebar`)
});
app.get('/api/restaurants/:id/reviews', (req, res) => {
  res.redirect(`http://localhost:3003/api/restaurants/${req.params.id}/reviews`)
});
app.get('/api/restaurants/:id/nearby', (req, res) => {
  res.redirect(`http://localhost:3004/api/restaurants/${req.params.id}/nearby`)
});

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});