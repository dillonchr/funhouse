const bookmancy = require('bookmancy');

module.exports = (options, onResponse) => {
    let promise;
    if (options.source === 'ebay') {
        const query = options.query || Object.entries(options)
            .filter(([key]) => ['author', 'title', 'publisher', 'year'].includes(key))
            .map(([k, val]) => val)
            .join(' ');
        const call = options.sold ? bookmancy.ebay.searchSoldListings : (options.live ? bookmancy.ebay.searchLiveListings : bookmancy.ebay.search);
        promise = call(query);
    } else {
        const call = options.withUrl ? bookmancy.abe.searchWithUrlInResponse : bookmancy.abe.search;
        promise = call(options);
    }
    promise
        .then(results => onResponse(null, results))
        .catch(onResponse);
};
