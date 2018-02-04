const gdq = require('./gdq');

module.exports = (req, res) => {
    gdq((err, games) => {
        const status = err ? 500 : 200;
        const data = err ? {
            error: true,
            message: err.message
        } : games;
        res.writeHead(status, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data), 'utf-8');
    });
};
