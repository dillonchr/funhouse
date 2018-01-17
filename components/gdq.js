const moment = require('moment');
const jsdom = require('jsdom');

const getLocalMoment = d => moment(d).utcOffset(`-0${new Date().getMonth() ? 5 : 6}:00`);

const parsePage = document => {
    return Array.from(document.querySelectorAll('#runTable tbody tr'))
        .map(r => {
            const tds = r.querySelectorAll('td');
            if (tds.length === 4) {
                return {
                    start: getLocalMoment(tds[0].textContent.trim()),
                    title: tds[1].textContent.trim(),
                    runners: tds[2].textContent.trim()
                };
            } else if (r.className.includes('second-row')) {
                return tds[0].textContent.trim();
            }
        })
        .reduce((schedule, datum) => {
            if (typeof datum === 'object') {
                return [...schedule, datum];
            } else if (typeof datum === 'string') {
                const game = schedule[schedule.length - 1];
                game.estimate = datum;
                const estimate = datum
                    .split(':')
                    .map(n => +n)
                    .reduce((sum, count, i) => {
                        switch(i) {
                            case 0:
                                return sum + (count * 60 * 60);
                            case 1:
                                return sum + (count * 60);
                            case 2:
                            default:
                                return sum + count;
                        }
                    }, 0);
                game.ends = getLocalMoment(game.start).add(estimate, 's');
                game.done = getLocalMoment().isAfter(game.ends);
            }
            return schedule;
        }, [])
        .filter(g => !g.done);
};

const getDom = url => {
    return new Promise((resolve, reject) => {
        jsdom.env(url, (err, w) => {
            if (!err && !!w) {
                resolve(w.document);
            } else {
                reject(err);
            }
        });
    });
};

module.exports = (req, res) => getDom('https://gamesdonequick.com/schedule')
    .then(parsePage)
    .then(games => {
        try {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(games), 'utf-8');
        } catch (err) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end('{"error":true,"message":"Server error"}');
        }
    });