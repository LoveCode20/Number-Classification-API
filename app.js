const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true;
}

function isPerfect(n) {
    let sum = 0;
    for (let i = 1; i < n; i++) {
        if (n % i === 0) sum += i;
    }
    return sum === n;
}

function isArmstrong(n) {
    const numStr = n.toString();
    const power = numStr.length;
    return n === numStr.split('').reduce((acc, digit) => acc + Math.pow(parseInt(digit), power), 0);
}

async function getFunFact(n) {
    try {
        const response = await axios.get(`http://numbersapi.com/${n}/math?json`);
        return response.data.text || 'No fun fact available.';
    } catch (error) {
        return 'No fun fact available.';
    }
}

// Endpoint handling the query parameter
app.get('/api/classify-number', async (req, res) => {
    const { number } = req.query; // Destructure the query parameter

    if (number === undefined) {
        return res.status(400).json({ error: 'Please provide a number query parameter.' });
    }

    if (isNaN(number)) {
        return res.status(400).json({ number, error: true });
    }

    const num = parseInt(number);
    const properties = [];

    if (isArmstrong(num)) properties.push("armstrong");
    properties.push(num % 2 === 0 ? "even" : "odd");

    const result = {
        number: num,
        is_prime: isPrime(num),
        is_perfect: isPerfect(num),
        properties: properties,
        digit_sum: Math.abs(num).toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0),
        fun_fact: await getFunFact(num)
    };

    res.status(200).json(result);
});

// 404 Error Handler
app.use((req, res) => {
    res.status(404).json({ error: 'The requested URL was not found on the server.' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
