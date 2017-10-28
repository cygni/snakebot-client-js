(function () {
    function gameheader(it
        /**/) {
        const out = `<NEWLINE>==========================================================================<NEWLINE>Playback of game id: ${it.gameId} (${it.totalGameTicks}) game ticks<NEWLINE>==========================================================================<NEWLINE>`; return out;
    } let itself = gameheader,
            _encodeHTML = (function (doNotSkipEncoded) {
                let encodeHTMLRules = {
                            '&': '&#38;', '<': '&#60;', '>': '&#62;', '"': '&#34;', "'": '&#39;', '/': '&#47;'
                        },
                        matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
                return function (code) {
                    return code ? code.toString().replace(matchHTML, m => encodeHTMLRules[m] || m) : '';
                };
            }()); if (typeof module !== 'undefined' && module.exports) module.exports = itself; else if (typeof define === 'function')define(() => itself); else { window.render = window.render || {}; window.render.gameheader = itself; }
}());
