function Topic(options){
    EventEmitter.call(this, arguments);
    
    _.extend(this, {
          author    : false
        , title     : false
        , body      : false
        , topics    : []
        , sel       : false
        , index     : false
    });
    
    _.extend(this, options);
    
    if (this.sel) this.bind();
}

inherits(Topic, EventEmitter);

Topic.prototype.bind = function(){
    var self = this;
    this.sel.click(function(e){
        self.emit('click', self);
    });
}

Topic.prototype.select = function(){
    this.sel.addClass('selected');
    return this;
}

Topic.prototype.deselect = function(){
    this.sel.removeClass('selected');
    return this;
}

Topic.prototype.enter = function(){
    log('enter pressed on topic ' + this._id );
}