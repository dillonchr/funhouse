const bookmancy = require('bookmancy');

const getBookmancyResults = (options, onResponse) => {
    let promise;
    if (options.source === 'ebay') {
        const ebayOpts = Object.entries(options)
            .filter(([key]) => ['author', 'title', 'publisher', 'year'].includes(key))
            .map(([k, val]) => val)
            .join(' ');
        promise = bookmancy.ebay.search(ebayOpts)
    } else {
        promise = bookmancy.abe.search(options);
    }
    promise
        .then(results => onResponse(null, results))
        .catch(onResponse);
};

module.exports = (req, res) => {
    const data = req.url.slice(req.url.indexOf('?') + 1)
        .split('&')
        .reduce((obj, pair) => {
            const [key, value] = pair.split('=');
            return {...obj, [key]: decodeURIComponent(value)};
        }, {});
    getBookmancyResults(data, (err, searchResults) => {
        const status = err ? 500 : 200;
        const data = err ? {error:true,message:err.message} : searchResults;
        res.writeHead(status, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data), 'utf-8');
    });
};
