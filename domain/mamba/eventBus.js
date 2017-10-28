function EventBus() {
    const listeners = {};

    function subscribe(listenerCb) {
        const listenerId = guid();
        listeners[listenerId] = listenerCb;
        return listenerId;
    }

    function unsubscribe(listenerId) {
        listeners[listenerId] = null;
    }

    function publish(event) {
        for (const id in listeners) {
            const cb = listeners[id];
            if (cb) {
                cb(event);
            }
        }
    }

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return `${s4() + s4()}-${s4()}-${s4()}-${
            s4()}-${s4()}${s4()}${s4()}`;
    }

    return Object.freeze({
        publish,
        subscribe,
        unsubscribe
    });
}

exports.new = EventBus;
