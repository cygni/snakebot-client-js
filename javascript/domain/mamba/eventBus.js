function EventBus(){

  var listeners = {};

  function subscribe(listenerCb){
    var listenerId = guid();
    listeners[listenerId] = listenerCb;
    return listenerId;
  }

  function unsubscribe(listenerId){
    listeners[listenerId] = null;
  }

  function publish(event){
    for (var id in listeners) {
      var cb = listeners[id];
      if(cb){
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
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  return Object.freeze({
    publish : publish,
    subscribe : subscribe,
    unsubscribe : unsubscribe
  });

};

exports.new = EventBus;