const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let favoritePairs = [];

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.post('/favorites', (req, res) => {
    const { baseCurrency, targetCurrency } = req.body;
    console.log('Received favorite:', baseCurrency, targetCurrency); 
    const favorite = { baseCurrency, targetCurrency };
    favoritePairs.push(favorite);
    res.json(favorite);
});

app.get('/favorites', (req, res) => {
    res.json(favoritePairs);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
