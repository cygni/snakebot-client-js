(function () {
    function tournamentresult(it
        /**/) {
        let out = `═══ TOURNAMENT RESULTS ═══════════════════════════════<NEWLINE><NEWLINE>Id: ${it.gameId}<NEWLINE>Tournament id: ${it.tournamentId}<NEWLINE>Tournament name: ${it.tournamentName}<NEWLINE><NEWLINE>Winner: ${it.results.winnerByPoints.termColor}█ ${it.colors.reset}${it.results.winnerByPoints.label}->${it.results.winnerByPoints.name}<NEWLINE><NEWLINE>Points:<NEWLINE>`; const arr1 = it.results.points; if (arr1) {
            let value,
                    index = -1,
                    l1 = arr1.length - 1; while (index < l1) { value = arr1[index += 1]; out += `${index + 1}. ${value.name}, ${value.points} p.<NEWLINE>`; }
        } out += '<NEWLINE>═══ proudly presented by Cygni ═══════════════════════<NEWLINE>'; return out;
    } let itself = tournamentresult,
            _encodeHTML = (function (doNotSkipEncoded) {
                let encodeHTMLRules = {
                            '&': '&#38;', '<': '&#60;', '>': '&#62;', '"': '&#34;', "'": '&#39;', '/': '&#47;'
                        },
                        matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
                return function (code) {
                    return code ? code.toString().replace(matchHTML, m => encodeHTMLRules[m] || m) : '';
                };
            }()); if (typeof module !== 'undefined' && module.exports) module.exports = itself; else if (typeof define === 'function')define(() => itself); else { window.render = window.render || {}; window.render.tournamentresult = itself; }
}());
