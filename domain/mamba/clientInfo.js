const os = require('os');
const version = require('../../package.json').version || 'unknown';

function ClientInfo() {
    const type = 'se.cygni.snake.api.request.ClientInfo';
    const ifaces = os.networkInterfaces();
    const language = 'JavaScript';
    const languageVersion = process.versions.v8;
    const operatingSystem = `Mac OS X ${os.type()}`;
    const operatingSystemVersion = os.release();

    const marshall = () => ({
        type,
        language,
        languageVersion,
        operatingSystem,
        operatingSystemVersion,
        clientVersion: version
    });

    const toString = () => 'ClientInfo';

    return Object.freeze({
        marshall,
        toString,
        type
    });
}

exports.new = ClientInfo;
exports.type = ClientInfo().type;
