function EventObject(){
    this._eid = uuid();
}

EventObject.prototype.addListener = function( type, fn ){
    Event.subscribe( type, fn, this._eid );
    return this;
}

EventObject.prototype.on = EventObject.prototype.addListener;

EventObject.prototype.removeListener = function( type, fn ){
    Event.unsubscribe( type, fn, this._eid );
    return this;
}


EventObject.prototype.notify = function( type, payload ){
    Event.notify({
        id: this._eid,
        type: type
    }, payload);
}

EventObject.prototype.emit = EventObject.prototype.notify;