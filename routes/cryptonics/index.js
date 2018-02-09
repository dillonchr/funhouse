const cryptonics = require('./cryptonics');
const { sendResponse, toError } = require('../../utils');

module.exports = (req, res) => {
    if (!req.body) {
        sendResponse(res, 400, toError(err ? err.message : 'No data to encrypt/decrypt'));
    } else {
        const direction = /\/decrypt/i.test(req.url) ? 'decrypt' : 'encrypt';
        const { offset, body } = req.body;
        sendResponse(res, 200, {
            offset,
            body: cryptonics[direction](offset, body)
        });
    }
};

module.exports.shouldRoute = req => /^\/cryptonics/.test(req.url);
