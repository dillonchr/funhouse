module.exports = (req, callback) => {
    const body = [];
    req
        .on('data', chunk => body.push(chunk))
        .on('end', () => {
            try {
                const postMessage = Buffer.concat(body).toString();
                const parsed = JSON.parse(postMessage);
                callback(null, parsed);
            } catch (err) {
                callback(err);
            }
        });
};
