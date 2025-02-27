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

        try {
            const response = await fetch('https://api.schoology.com/v1/users/me/grades', {
                headers: oauth.toHeader(oauth.authorize({ url: 'https://api.schoology.com/v1/users/me/grades', method: 'GET' })),
            });
            const data = await response.json();
            return new Response(JSON.stringify(data), { status: 200 });
        } catch (error) {
            return new Response(JSON.stringify({ error: 'Failed to fetch grades' }), { status: 500 });
        }
    },
};
