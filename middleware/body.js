module.exports = (req, res, callback) => {
    const body = [];
    req
        .on('data', chunk => body.push(chunk))
        .on('end', () => {
            if (body.length) {
                try {
                    const postMessage = Buffer.concat(body).toString();
                    req.body = JSON.parse(postMessage);
                    callback();
                } catch (err) {
                    callback(err);
                }
            } else {
                callback();
            }
        });
};
