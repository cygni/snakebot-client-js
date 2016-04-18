function ClientInfo() {

    var os = require('os');
    var ifaces = os.networkInterfaces();

    var type = 'se.cygni.snake.api.request.ClientInfo';

    var language = 'JavaScript';
    var version = require('../../package.json').version || 'unkown';
    var ipAddress = 'unkown';
    var operatingSystem = os.type() + ' ' + os.release();

    var findIP = function () {
        Object.keys(ifaces).forEach(function (ifname) {
            var alias = 0;

            ifaces[ifname].forEach(function (iface) {
                if ('IPv4' !== iface.family || iface.internal !== false) {
                    // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                    return;
                }
                ipAddress = iface.address;
            });
        });
    };

    findIP();

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
