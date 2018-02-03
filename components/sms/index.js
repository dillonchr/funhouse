const body = require('../../utils/body');
const sms = require('./sender');
const inflation = require('../inflation');
const gdq = require('../gdq');

module.exports = (req, res) => {
    body(req, (err, data) => {
        if (!err) {
            const { from, text, applicationId } = data;
            if (applicationId === process.env.BANDWIDTH_APP_ID) {
                if (/how much (was|is) /i.test(text)) {
                    inflation.sms(text, text => sms.send(from, text));
                } else if (/gdq/i.test(text)) {
                    gdq.sms(text => sms.send(from, text));
                }
            }
        } else {
            console.error(err);
        }
    });
    res.writeHead(200);
    res.end();
};