function ClientInfo() {

    var type            = 'se.cygni.snake.api.request.ClientInfo';
    var os              = require('os');
    var version         = require('../package.json').version || 'unknown';
    var ifaces          = os.networkInterfaces();
    var language        = 'JavaScript';
    var ipAddress       = 'unknown';
    var operatingSystem = os.type() + ' ' + os.release();

    findIP();

    function findIP() {
        Object.keys(ifaces).forEach(function (ifname) {
            var alias = 0;
            ifaces[ifname].forEach(function (iface) {
                if ('IPv4' !== iface.family || iface.internal !== false) {
                    return;
                }
                ipAddress = iface.address;
            });
        });
    };

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
