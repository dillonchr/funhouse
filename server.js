require('dotenv').config();
const port = process.env.port || 3000;
const http = require('http');
const auth = require('./components/auth');
const bookmancy = require('./components/bookmancy');
const gdq = require('./components/gdq');
const fired = require('./components/fired');
const inflation = require('./components/inflation');
const paycheck = require('./components/paycheck');
const budget = require('./components/budget');
const cryptonics = require('./components/cryptonics');
const dailytext = require('./components/dailytext');
const { toError } = require('./utils');

http
    .createServer((req, res) => {
        auth.isTokenValid(req.headers['x-api-token'], (err, isValid) => {
            if (isValid) {
                if (/^\/fired/.test(req.url)) {
                    return fired(req, res);
                }
                if (/^\/books/.test(req.url)) {
                    return bookmancy(req, res);
                }
                if (/^\/gdq/.test(req.url)) {
                    return gdq(req, res);
                }
                if (/^\/inflation/.test(req.url)) {
                    return inflation(req, res);
                }
                if (/^\/paycheck/.test(req.url)) {
                    return paycheck(req, res);
                }
                if (/^\/budget/.test(req.url)) {
                    return budget(req, res);
                }
                if (/^\/cryptonics/.test(req.url)) {
                    return cryptonics(req, res);
                }
                if (/^\/dailytext/.test(req.url)) {
                    return dailytext(req, res);
                }
            }
            const status = err ? 500 : (isValid ? 200 : 401);
            const data = err ? toError(err.message) : (isValid ? {} : toError('unauthorized'));
            res.writeHead(status, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(data), 'utf-8');
        });
    })
    .listen(port);

console.log(`Server running at https://localhost:${port}/`);
