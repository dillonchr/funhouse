const Raven = require('raven');
const USING_RAVEN = !!process.env.SENTRY_URL;

if (USING_RAVEN) {
    Raven.config(process.env.SENTRY_URL).install();
}

module.exports = {
    track: (err) => {
        if (USING_RAVEN) {
            Raven.captureException(err);
        } else {
            console.error(err);
        }
    }
};
