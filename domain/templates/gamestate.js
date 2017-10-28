(function () {
    function gamestate(it
        /**/) {
        let out = `▼ ▼ ▼ GAME STATE (tick: ${it.gameTick}) ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼<NEWLINE><NEWLINE>`; for (const playerId in it.gameSnakes) { out += ` ${it.gameSnakes[playerId].termColor}█ ${it.colors.reset}`; if (it.gameSnakes[playerId].highlight) { out += `${it.colors.bold}`; }out += `${it.gameSnakes[playerId].label}->${it.gameSnakes[playerId].name}`; if (it.gameSnakes[playerId].highlight) { out += `${it.colors.reset}`; }out += ` [${it.gameSnakes[playerId].length}] (${it.gameSnakes[playerId].points} p.)`; if (it.gameSnakes[playerId].isDead) { out += `${' ' + ('\x1b[41m') + '┼ '}${it.gameSnakes[playerId].tickOfDeath}\x1b[0m`; }out += '<NEWLINE>'; } out += `${it.gameMap}<NEWLINE>Decided ms.: ${it.executionTime}<NEWLINE>`; if (it.debugData) { out += `<NEWLINE>Debug data: ${it.debugData}<NEWLINE>`; } return out;
    } let itself = gamestate,
            _encodeHTML = (function (doNotSkipEncoded) {
                let encodeHTMLRules = {
                            '&': '&#38;', '<': '&#60;', '>': '&#62;', '"': '&#34;', "'": '&#39;', '/': '&#47;'
                        },
                        matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
                return function (code) {
                    return code ? code.toString().replace(matchHTML, m => encodeHTMLRules[m] || m) : '';
                };
            }()); if (typeof module !== 'undefined' && module.exports) module.exports = itself; else if (typeof define === 'function')define(() => itself); else { window.render = window.render || {}; window.render.gamestate = itself; }
}());
