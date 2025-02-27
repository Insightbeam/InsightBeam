const express = require('express');
const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

const router = express.Router();

const oauth = OAuth({
    consumer: {
        key: process.env.SCHOOLOGY_CONSUMER_KEY,
        secret: process.env.SCHOOLOGY_CONSUMER_SECRET,
    },
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64'),
});

router.get('/grades', (req, res) => {
    const requestData = {
        url: 'https://api.schoology.com/v1/users/me/grades',
        method: 'GET',
    };

    axios.get(requestData.url, {
        headers: oauth.toHeader(oauth.authorize(requestData, req.user.token)),
    })
    .then(response => {
        res.json(response.data);
    })
    .catch(error => {
        res.status(500).json({ error: 'Failed to fetch grades' });
    });
});

module.exports = router;
