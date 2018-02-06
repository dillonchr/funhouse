const bookmancy = require('bookmancy');

module.exports = (options, onResponse) => {
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
