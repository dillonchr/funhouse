const jsdom = require('jsdom');
const async = require('async');
const { errors } = require('../../utils');
const model = require('./fired.model');

const getCurrentRoster = onResponse => {
    jsdom.env('https://consumeraffairs.com/about/staff/', (err, window) => {
        if (!err) {
            try {
                const roster = [...window.document.querySelectorAll('.vcard')]
                    .map(e => ({
                        name: e.querySelector('h2.fn').innerHTML,
                        profilePic: e.querySelector('.photo.head_shot').src,
                        position: e.querySelector('h3.title').innerHTML,
                        bio: e.querySelector('.bio.entry > p').innerHTML.trim(),
                        fired: false
                    }));
                if (!roster || !roster.length) {
                    const schemaError = new Error('schema error: roster empty');
                    errors.track(schemaError);
                    onResponse(schemaError);
                } else {
                    onResponse(null, roster);
                }
            } catch (scrapeError) {
                errors.track(scrapeError);
                onResponse(scrapeError);
            }
        } else {
            errors.track(err);
            onResponse(err);
        }
    });
};

const getNewFires = onResponse => {
    async.parallel([getCurrentRoster, model.getEmployees], (err, rosters) => {
        const [currentRoster, archiveRoster] = rosters;
        if (!archiveRoster) {
            model.saveEmployees(currentRoster);
            onResponse(null, []);
        } else {
            const newFires = archiveRoster
                .filter(e => !e.fired && !currentRoster.some(c => c.name === e.name))
                .map(e => e.name);

            const newHires = currentRoster
                .filter(c => !archiveRoster.some(e => e.name === c.name));

            if (newHires.length) {
                model.saveEmployees(newHires);
            }
            if (newFires.length) {
                model.fireEmployees(newFires);
            }
            onResponse(null, newFires);
        }
    });
};

module.exports = {
    update: getNewFires,
    list: model.getFiredEmployees
};
