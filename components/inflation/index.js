const inflation = require('./inflation');
const Errors = require('../../utils/errors');

module.exports = {
    api(req, res) {
        const [ year, dollars ] = req.url.split('/').slice(2);
        const status = year && dollars ? 200 : 500;
        const data = year && dollars ? {
            valueThen: inflation(dollars, year),
            valueNow: dollars,
            year
        } : {error:true,message:'missing year or dollar `/inflation/year/dollars`'};
        res.writeHead(status, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data), 'utf-8');
    },
    sms(cmd, respondWith) {
        try {
            const matches = cmd.match(/\$([\d\.]+) in (\d{4})\??/i);
            if (matches && matches.length === 3) {
                const [dollars, year] = matches.slice(1);
                const value = inflation(dollars, year);
                respondWith(value ? `$${dollars} was worth $${value} in ${year}` : `I don't know what the rate was for ${year}.`);
            } else {
                respondWith('try again like this:\nhow much was $100 in 1989');
            }
        } catch (err) {
            Errors.track(err);
            respondWith('Man, I straight up forgot what you wanted');
        }
    }
};
