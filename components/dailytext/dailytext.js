const jsdom = require('jsdom');
const { errors } = require('../../utils');

module.exports = onResponse => {
    jsdom.env('https://wol.jw.org/en/wol/h/r1/lp-e', (err, window) => {
        if (err) {
            errors.track(err);
            onResponse(err);
        } else {
            try {
                const now = new Date();
                const month = (now.getMonth() + 1).toString().padStart(2, '0');
                const day = (now.getDate()).toString().padStart(2, '0');
                const year = now.getFullYear();
                const text = window.document.querySelector(`[data-date^="${year}-${month}-${day}"]`);
                const themeScriptureRaw = text.querySelector('.themeScrp > em').textContent.trim();

                onResponse(null, {
                    date: text.querySelector('header').textContent.trim(),
                    themeScripture: themeScriptureRaw.substr(0, themeScriptureRaw.length - 1),
                    themeScriptureLocation: text.querySelector('.themeScrp a.b').textContent.trim(),
                    comments: text.querySelector('.bodyTxt').textContent.trim()
                });
            } catch (error) {
                errors.track(error);
                onResponse(error);
            }
        }
    });
};
