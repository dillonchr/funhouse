const body = require('../../utils/body');
const sms = require('./sender');
const inflation = require('../inflation/inflation');

module.exports = (req, res) => {
    body(req, (err, data) => {
        if (!err) {
            const { from, text, applicationId } = data;
            if (applicationId === process.env.BANDWIDTH_APP_ID) {
                if (/how much (was|is) /i.test(text)) {
                    sms.send(from, inflation(text));
                } else {
                    console.log(from, text);
                }
            }
        } else {
            console.error(err);
        }
    });
    res.writeHead(200);
    res.end();
};