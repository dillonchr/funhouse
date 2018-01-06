require('dotenv').config();
const http = require('http');
const auth = require('./components/auth');
const bookmancy = require('./components/bookmancy');
const port = process.env.port || 3000;

http
    .createServer((req, res) => {
        auth.isTokenValid(req.headers['x-api-token'])
            .then(isValid => {
                let status, reply;
                
                if (!isValid) {
                    status = 401;
                    reply = '{"error": true, "message": "Unauthorized access"}';
                } else {
                    if (/^\/books/.test(req.url)) {
                        return bookmancy.handleRequest(req, res);
                    }
                    status = 200;
                    reply = Date.now().toString();
                }

                res.writeHead(status, {'Content-Type': 'application/json'});
                res.end(reply, 'utf-8');
            });
    })
    .listen(port);

console.log(`Server running at http://localhost:${port}/`);
