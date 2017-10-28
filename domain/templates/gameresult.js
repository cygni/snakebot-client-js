(function () {
    function gameresult(it
        /**/) {
        let out = `═══ End of game ══════════════════════════════════════<NEWLINE>Id: ${it.gameId}<NEWLINE><NEWLINE>Winner: ${it.results.winnerByPoints.termColor}█ ${it.colors.reset}${it.results.winnerByPoints.label}->${it.results.winnerByPoints.name} [${it.results.winnerByPoints.length}], ${it.results.winnerByPoints.points} p.<NEWLINE><NEWLINE>Heroes:<NEWLINE>`; const arr1 = it.results.livingSnakesByPoints; if (arr1) {
            var value,
                    index = -1,
                    l1 = arr1.length - 1; while (index < l1) { value = arr1[index += 1]; out += `${index + 1}. ${value.termColor}█ ${it.colors.reset}${value.label}->${value.name} [${value.length}], ${value.points} p.<NEWLINE>`; }
        } out += '<NEWLINE>Killed-in-action, by game tick:<NEWLINE>'; const arr2 = it.results.deadSnakesByTick; if (arr2) {
            var value,
                    index = -1,
                    l2 = arr2.length - 1; while (index < l2) { value = arr2[index += 1]; out += `${value.tickOfDeath}. ${value.termColor}█ ${it.colors.reset}`; if (value.highlight) { out += `${it.colors.bold}`; }out += `${value.label}->${value.name}`; if (value.highlight) { out += `${it.colors.reset}`; }out += ` [${value.length}], (${value.deathReason}) ${value.points} p.<NEWLINE>`; }
        } out += '<NEWLINE>══════════════════════════════════════════════════════<NEWLINE>'; return out;
    } let itself = gameresult,
            _encodeHTML = (function (doNotSkipEncoded) {
                let encodeHTMLRules = {
                            '&': '&#38;', '<': '&#60;', '>': '&#62;', '"': '&#34;', "'": '&#39;', '/': '&#47;'
                        },
                        matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
                return function (code) {
                    return code ? code.toString().replace(matchHTML, m => encodeHTMLRules[m] || m) : '';
                };
            }()); if (typeof module !== 'undefined' && module.exports) module.exports = itself; else if (typeof define === 'function')define(() => itself); else { window.render = window.render || {}; window.render.gameresult = itself; }
}());
