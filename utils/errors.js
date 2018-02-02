const Raven = require('raven');
Raven.config(process.env.SENTRY_URL).install();

module.exports = {
    track(err) {
        Raven.captureException(err);
    }
};
