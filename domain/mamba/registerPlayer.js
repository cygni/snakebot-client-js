function RegisterPlayer(name, settings) {
    const type = 'se.cygni.snake.api.request.RegisterPlayer';
    const playerName = name || `Viper-${new Date().getMilliseconds()}`;
    var settings = settings || {};

    const toString = function () {
        return `<Type:${type}, playerName:${playerName}, settings:${settings.toString()}>`;
    };

    const marshall = function () {
        return {
            type,
            playerName,
            gameSettings: settings.marshall()
        };
    };

    return Object.freeze({
        marshall,
        toString,
        type
    });
}

exports.new = RegisterPlayer;
exports.type = RegisterPlayer().type;
