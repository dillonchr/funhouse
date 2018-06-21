const fired = require('@dillonchr/fired');
const {toError, sendResponse} = require('../utils');

const options = {
    url: process.env.FIRED_URL,
    collection: process.env.FIRED_COLLECTION,
    selectors: {
        employees: process.env.FIRED_SELECTOR_EMPLOYEES,
        name: process.env.FIRED_SELECTOR_NAME,
        position: process.env.FIRED_SELECTOR_POSITION,
        profilePic: process.env.FIRED_SELECTOR_PROFILEPIC,
        bio: process.env.FIRED_SELECTOR_BIO
    }
};

module.exports = (req, res) => {
    const call = /\/update/.test(req.url) ? fired.update : fired.list;
    call(options, (err, results) => {
        const status = err ? 500 : 200;
        const data = err ? toError(err.message) : results;
        sendResponse(res, status, data);
    });
};

module.exports.shouldRoute = req => /^\/fired/.test(req.url);
