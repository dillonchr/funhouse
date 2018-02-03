const fired = require('./fired');

module.exports = (req, res) => {
    const call = /\/update/.test(req.url) ? fired.update : fired.list;
    call((err, results) => {
        const status = err ? 500 : 200;
        const data = err ? {
                error: true,
                message: err.meesage
            } : results;
        res.writeHead(status, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data), 'utf-8');
    });
};