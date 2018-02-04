const inflation = require('./inflation');
const Errors = require('../../utils/errors');

module.exports = (req, res) => {
    const [ year, dollars ] = req.url.split('/').slice(2);
    const status = year && dollars ? 200 : 500;
    const data = year && dollars ? {
        valueThen: inflation(dollars, year),
        valueNow: dollars,
        year
    } : {error:true,message:'missing year or dollar `/inflation/year/dollars`'};
    res.writeHead(status, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data), 'utf-8');
};
