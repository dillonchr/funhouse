//const Raven = require('raven');
//Raven.config(process.env.SENTRY_URL).install();

module.exports = {
    track(err) {
        console.log('would be tracking an error', err);
        //Raven.captureException(err);
    }
};
