const express = require('express');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const axios = require('axios');

const router = express.Router();

const oauth = OAuth({
    consumer: {
        key: process.env.SCHOOLOGY_CONSUMER_KEY,
        secret: process.env.SCHOOLOGY_CONSUMER_SECRET,
    },
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64'),
});

router.get('/login', (req, res) => {
    const requestData = {
        url: 'https://api.schoology.com/v1/users/me',
        method: 'GET',
    };

    const token = {
        key: req.query.oauth_token,
        secret: req.query.oauth_token_secret,
    };

    axios.get(requestData.url, {
        headers: oauth.toHeader(oauth.authorize(requestData, token)),
    })
    .then(response => {
        res.json(response.data);
    })
    .catch(error => {
        res.status(500).json({ error: 'Authentication failed' });
    });
});

module.exports = router;
