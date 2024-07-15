import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let favoritePairs = [];

app.post('/favorites', (req, res) => {
    const { baseCurrency, targetCurrency } = req.body;
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