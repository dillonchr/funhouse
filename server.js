require('dotenv').config();
const port = process.env.port || 3000;
const http = require('http');
const auth = require('./middleware/auth');
const router = require('./middleware/router');
const { toError } = require('./utils');

http
    .createServer((req, res) => {
        auth.getUser(req.headers['x-api-token'], (err, user) => {
            if (user) {
                req.hasAccess = n => user.access.includes('*') || user.access.includes(n);
                return router(req, res);
            }
            const status = err ? 500 : 401;
            const data = err ? toError(err.message) : toError('unauthorized');
            res.writeHead(status, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(data), 'utf-8');
        });
    })
    .listen(port);

console.log(`Server running at https://localhost:${port}/`);
