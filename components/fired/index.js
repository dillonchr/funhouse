const fired = require('./fired');

module.exports = {
    api(req, res) {
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
    },
    sms(text, respondWith) {
        const call = /update/i.test(text) ? fired.update : fired.list;
        call((err, results) => {
            if (err) {
                respondWith('Sorry, couldn\'t get results, server errored out.');
            } else {
                respondWith(results.length ? results.map(e => e.name).join('\n') : 'No one new.');
            }
        });
    }
};