require('dotenv').config();
const http = require('http');

http
    .createServer((req, res) => {
        console.log(req.url);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(Date.now().toString(), 'utf-8');
    })
    .listen(process.env.port);

console.log(`Server running at http://localhost:${process.env.port}/`);
