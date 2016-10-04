function ClientInfo() {

    var type                   = 'se.cygni.snake.api.request.ClientInfo';
    var os                     = require('os');
    var version                = require('../package.json').version || 'unknown';
    var ifaces                 = os.networkInterfaces();
    var language               = 'JavaScript';
    var languageVersion        = process.versions.v8;
    var operatingSystem        = 'Mac OS X ' + os.type();
    var operatingSystemVersion = os.release();

    var marshall = function () {
        return {
            type: type,
            language: language,
            languageVersion: languageVersion,
            operatingSystem: operatingSystem,
            operatingSystemVersion: operatingSystemVersion,
            clientVersion: version
        };
    };

    return Object.freeze({
        marshall: marshall,
        toString: toString,
        type: type
    });
}

exports.new = ClientInfo;
exports.type = ClientInfo().type;
