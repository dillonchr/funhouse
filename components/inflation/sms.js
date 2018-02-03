const inflation = require('./inflation');
const Errors = require('../../utils/errors');

module.exports = cmd => {
    try {
        const matches = cmd.match(/\$([\d\.]+) in (\d{4})\??/i);
        if (matches && matches.length === 3) {
            const [dollars, year] = matches.slice(1);
            const value = inflation(dollars, year);
            return value ? `$${dollars} was worth $${value} in ${year}` : `I don't know what the rate was for ${year}.`;
        } else {
            return 'try again like this:\nhow much was $100 in 1989';
        }
    } catch (err) {
        Errors.track(err);
        return 'Man, I straight up forgot what you wanted';
    }
}