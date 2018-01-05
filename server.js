require('dotenv').config();
const http = require('http');
const auth = require('./components/auth');

http
    .createServer((req, res) => {
        auth.isTokenValid(req.headers['x-api-token'])
            .then(isValid => {
                let status, reply;
                
                if (!isValid) {
                    status = 401;
                    reply = '{"error": true, "message": "Unauthorized access"}';
                } else {
                    status = 200;
                    reply = Date.now().toString();
                    switch(req.method) {
                        //  http://www.restapitutorial.com/lessons/httpmethods.html
                    }
                }

                res.writeHead(status, {'Content-Type': 'application/json'});
                res.end(reply, 'utf-8');
            });
    })
    .listen(process.env.port);

console.log(`Server running at http://localhost:${process.env.port}/`);
