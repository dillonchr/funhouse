const gdq = require('./gdq');

module.exports = {
    api(req, res) {
        gdq((err, games) => {
            const status = err ? 500 : 200;
            const data = err ? {
                error: true,
                message: err.message
            } : games;
            res.writeHead(status, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(data), 'utf-8');
        });
    },
    sms(respondWith) {
        gdq((err, games) => {
            if (games && games.length) {
                const textResponse = games.slice(0, 5)
                    .map(({ runners, title, start, ends, estimate }) => {
                        return `${title}\n${start.format('h:mm A')} - ${ends.format('h:mm A')}\n${runners}\n`;
                    })
                    .join('---\n');
                respondWith(textResponse);
            } else {
                respondWith('Couldn\'t find any upcoming games in the schedule.');
            }
        });
    }
};
