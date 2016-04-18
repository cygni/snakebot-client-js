function ClientInfo() {

    var type = 'se.cygni.snake.api.request.ClientInfo';
    var language = 'JavaScript';
    var version = require('../../package.json').version || 'unkown';

    var findIP = function () {
        Object.keys(ifaces).forEach(function (ifname) {
            var alias = 0;

            ifaces[ifname].forEach(function (iface) {
                if ('IPv4' !== iface.family || iface.internal !== false) {
                    // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                    return;
                }
                // TODO: this doesn't work, fix it!
                return iface.address;
            });
        });
    };

    var os = require('os');
    var ifaces = os.networkInterfaces();
    var ipAddress = findIP();
    var operatingSystem = os.type() + ' ' + os.release();

    var marshall = function () {
        return {
            type: type,
            language: language,
            operatingSystem: operatingSystem,
            ipAddress: ipAddress,
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
