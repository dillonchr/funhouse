module.exports = (res, status, data) => {
    res.writeHead(status, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data), 'utf-8');
};
