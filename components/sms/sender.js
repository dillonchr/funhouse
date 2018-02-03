const Errors = require('../../utils/errors');
const Bandwidth = require('node-bandwidth');
const client = new Bandwidth({
    userId: process.env.BANDWIDTH_USER_ID,
    apiToken: process.env.BANDWIDTH_API_TOKEN,
    apiSecret: process.env.BANDWIDTH_API_SECRET 
});

module.exports = {
    send(to, text) {
        return client.Message.send({
            from: process.env.BANDWIDTH_PHONE_NUMBER,
            to,
            text
        })
            .then(msg => console.log(msg.id))
            .catch(Errors.track);
    }
};
