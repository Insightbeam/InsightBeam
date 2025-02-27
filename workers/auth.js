const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

export default {
    async fetch(request) {
        const oauth = OAuth({
            consumer: {
                key: SCHOOLOGY_CONSUMER_KEY,
                secret: SCHOOLOGY_CONSUMER_SECRET,
            },
            signature_method: 'HMAC-SHA1',
            hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64'),
        });

        const url = new URL(request.url);
        const token = {
            key: url.searchParams.get('oauth_token'),
            secret: url.searchParams.get('oauth_token_secret'),
        };

        try {
            const response = await fetch('https://api.schoology.com/v1/users/me', {
                headers: oauth.toHeader(oauth.authorize({ url: 'https://api.schoology.com/v1/users/me', method: 'GET' }, token)),
            });
            const data = await response.json();
            return new Response(JSON.stringify(data), { status: 200 });
        } catch (error) {
            return new Response(JSON.stringify({ error: 'Authentication failed' }), { status: 500 });
        }
    },
};
