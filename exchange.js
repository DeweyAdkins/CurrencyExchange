document.addEventListener('DOMContentLoaded', () => {
    const convertBtn = document.getElementById('convert-btn');
    const viewHistoricalBtn = document.getElementById('view-historical');
    const saveFavoriteBtn = document.getElementById('save-favorite');

    const baseCurrencySelect = document.getElementById('base-currency');
    const targetCurrencySelect = document.getElementById('target-currency');
    const amountInput = document.getElementById('amount');
    const resultSpan = document.getElementById('result');
    const historicalRatesContainer = document.getElementById('historical-rates-container');
    const favoritesDiv = document.getElementById('favorites');

    const apiKey = 'fca_live_6p6JnIHxeMPJc0YchZ5oQVu0ydcCdf2AwL8KfznL';
    const apiUrl = 'https://api.freecurrencyapi.com/v1';

    async function fetchCurrencies() {
        try {
            const response = await fetch(`${apiUrl}/latest?apikey=${apiKey}`);
            const data = await response.json();
            const currencies = Object.keys(data.data);

            currencies.forEach(currency => {
                const option = document.createElement('option');
                option.value = currency;
                option.innerText = currency;
                baseCurrencySelect.appendChild(option.cloneNode(true));
                targetCurrencySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching currencies:', error);
        }
    }

    async function fetchHistoricalRates() {
        const baseCurrency = baseCurrencySelect.value;
        const targetCurrency = targetCurrencySelect.value;
        const date = '2023-01-01';
        
        try {
            const response = await fetch(`${apiUrl}/historical?apikey=${apiKey}&base_currency=${baseCurrency}&date=${date}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch historical rates');
            }
    
            const data = await response.json();
            
            if (!data || !data.data || !data.data[date] || !data.data[date][targetCurrency]) {
                throw new Error('No historical rate found for the selected currencies');
            }
            
            const rate = data.data[date][targetCurrency];
            const message = `Historical exchange rate on ${date}: 1 ${baseCurrency} = ${rate} ${targetCurrency}`;
            historicalRatesContainer.innerText = message;
        } catch (error) {
            console.error('Error fetching historical rates:', error);
            historicalRatesContainer.innerText = 'Error fetching historical rates. Please try again.';
        }
    }

    async function convertCurrency() {
        const baseCurrency = baseCurrencySelect.value;
        const targetCurrency = targetCurrencySelect.value;
        const amount = amountInput.value;

        if (!baseCurrency || !targetCurrency || !amount) {
            alert('Please select currencies and enter an amount.');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/latest?apikey=${apiKey}&base_currency=${baseCurrency}`);
            const data = await response.json();
            const rate = data.data[targetCurrency];
            const convertedAmount = (amount * rate).toFixed(2);
            resultSpan.innerText = `${amount} ${baseCurrency} = ${convertedAmount} ${targetCurrency}`;
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
            alert('Error fetching exchange rate. Please try again.');
        }
    }

    async function saveFavorite(baseCurrency, targetCurrency) {
        try {
            const response = await fetch('http://localhost:3000/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ baseCurrency, targetCurrency }),
            });
            const data = await response.json();
            console.log('Favorite saved:', data);
            
            displayFavorites();
        } catch (error) {
            console.error('Error saving favorite:', error);
        }
    }

    async function displayFavorites() {
        try {
            const response = await fetch('http://localhost:3000/favorites');
            const favorites = await response.json();
            favoritesDiv.innerHTML = '';

            favorites.forEach(favorite => {
                const favElement = document.createElement('div');
                favElement.innerText = `${favorite.baseCurrency} to ${favorite.targetCurrency}`;
                favElement.addEventListener('click', () => {
                    baseCurrencySelect.value = favorite.baseCurrency;
                    targetCurrencySelect.value = favorite.targetCurrency;
                    convertCurrency();
                });
                favoritesDiv.appendChild(favElement);
            });
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    }
    convertBtn.addEventListener('click', convertCurrency);
    viewHistoricalBtn.addEventListener('click', fetchHistoricalRates);
    saveFavoriteBtn.addEventListener('click', () => {
        const baseCurrency = baseCurrencySelect.value;
        const targetCurrency = targetCurrencySelect.value;
        saveFavorite(baseCurrency, targetCurrency);
    });

    fetchCurrencies();
});
