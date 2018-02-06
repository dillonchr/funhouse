const cryptonics = require('./cryptonics');
const { getBody, sendResponse, toError } = require('../../utils');

module.exports = (req, res) => {
    getBody(req, (err, data) => {
        if (!data) {
            sendResponse(res, 400, toError(err ? err.message : 'No data to encrypt/decrypt'));
        } else {
            const direction = /\/decrypt/i.test(req.url) ? 'decrypt' : 'encrypt';
            const { offset } = data;
            sendResponse(res, 200, {
                offset,
                body: cryptonics[direction](offset, data.body)
            });
        }
    });
};
