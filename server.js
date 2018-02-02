require('dotenv').config();
const port = process.env.port || 3000;
const Errors = require('./utils/errors');
const https = require('https');
const fs = require('fs');
const auth = require('./components/auth');
const bookmancy = require('./components/bookmancy');
const gdq = require('./components/gdq');
const sms = require('./components/sms');

https
    .createServer({
        key: fs.readFileSync(process.env.SSL_KEY_PATH),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH)
    }, (req, res) => {
        auth.isTokenValid(req.headers['x-api-token'])
            .then(isValid => {
                let status, reply;

                if (!isValid) {
                    if (/^\/text/.test(req.url)) {
                        return sms(req, res);
                    }
                    status = 401;
                    reply = '{"error": true, "message": "Unauthorized access"}';
                } else {
                    if (/^\/books/.test(req.url)) {
                        return bookmancy.handleRequest(req, res);
                    }
                    if (/^\/gdq/.test(req.url)) {
                        return gdq(req, res);
                    }
                    status = 200;
                    reply = Date.now().toString();
                }

                res.writeHead(status, {'Content-Type': 'application/json'});
                res.end(reply, 'utf-8');
            });
    })
    .listen(port);

console.log(`Server running at https://localhost:${port}/`);
