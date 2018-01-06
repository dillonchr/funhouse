const bookmancy = require('bookmancy');

module.exports = {
    async handleRequest(req, res) {
        try {
            const data = req.url.slice(req.url.indexOf('?') + 1)
                .split('&')
                .reduce((obj, pair) => {
                    const [key, value] = pair.split('=');
                    return {...obj, [key]: decodeURIComponent(value)};
                }, {});
            if (!data.source) throw {};
            const searchResults = await this.getBookmancyResults(data);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(searchResults), 'utf-8');
        } catch (err) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end('{"error":true,"message":"Server error"}');
        }
    },
    getBookmancyResults(options) {
        switch(options.source) {
            case 'abe':
                return bookmancy.abe.search(options);
            case 'ebay':
                return bookmancy.ebay.search(
                    Object.entries(options)
                        .filter(([key]) => ['author', 'title', 'publisher', 'year'].includes(key))
                        .map(([k, val]) => val)
                        .join(' ')
                );
        }
        throw {};
    }
};
