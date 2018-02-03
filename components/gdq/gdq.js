const moment = require('moment');
const jsdom = require('jsdom');
const Errors = require('../../utils/errors');

const SCHEDULE_URL = 'https://gamesdonequick.com/schedule';

const getLocalMoment = d => moment(d).utcOffset(`-0${new Date().getMonth() ? 5 : 6}:00`);

module.exports = onResponse => {
    jsdom.env(SCHEDULE_URL, (err, window) => {
        if (err) {
            Errors.track(err);
            onResponse(err);
        } else {
            const pendingRuns = [...window.document.querySelectorAll('#runTable tbody tr')]
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
            onResponse(null, pendingRuns);
        }
    });
};
