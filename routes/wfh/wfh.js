const inbox = require('inbox');

module.exports = callback => {
    const client = inbox.createConnection(process.env.WFH_CONN_PORT, process.env.WFH_CONN_URL, {
        secureConnection: true,
        auth: {
            user: process.env.WFH_CONN_USER,
            pass: process.env.WFH_CONN_PASS
        }
    });

    client.connect();

    const itsANoGuys = () => {
        callback(null, {wfh: 0, who: []});
        client.close();
    };

    const loadMessages = n => client.listMessages(n, (err, messages) => {
        if (err) {
            callback(err);
        } else {
            const who = messages
                .filter(m => !m.flags.includes('\\Seen') && /wfh/i.test(m.title))
                .map(m => m.from.address.split('@').shift())
                .filter((who, i, a) => a.indexOf(who) === i);
            if (who.length) {
                callback(null, {wfh: 1, who});
            } else {
                itsANoGuys();
            }
        }
    });

    const openMailbox = () => client.openMailbox('INBOX', (err, info) => {
        if (err) {
            callback(err);
        } else {
            if (info.count) {
                loadMessages(Math.max(info.count, 30) * -1);
            } else {
                itsANoGuys();
            }
        }
    });

    client.on('connect', openMailbox);
    client.on('error', err => callback(err));
};
