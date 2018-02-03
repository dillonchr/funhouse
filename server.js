require('dotenv').config();
const port = process.env.port || 3000;
const http = require('http');
const auth = require('./components/auth');
const bookmancy = require('./components/bookmancy');
const gdq = require('./components/gdq');
const sms = require('./components/sms');
const fired = require('./components/fired');
const inflation = require('./components/inflation');

http
    .createServer((req, res) => {
        auth.isTokenValid(req.headers['x-api-token'], (err, isValid) => {
                let status, reply;

                if (!isValid) {
                    if (/^\/text/.test(req.url)) {
                        return sms(req, res);
                    }
                    status = 401;
                    reply = '{"error":true,"message":"Unauthorized access"}';
                } else {
                    if (/^\/fired/.test(req.url)) {
                        return fired.api(req, res);
                    }
                    if (/^\/books/.test(req.url)) {
                        return bookmancy(req, res);
                    }
                    if (/^\/gdq/.test(req.url)) {
                        return gdq.api(req, res);
                    }
                    if (/^\/inflation/.test(req.url)) {
                        return inflation.api(req, res);
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
