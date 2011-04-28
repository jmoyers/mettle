function Grid(options){
    _.extend(this, {
          topics    : []
        , selection : -1
        , width     : false
        , height    : false
    });
    
    _.extend(this, options);
}

Grid.prototype.getSelection = function(){
    if(this.selection == -1) return false;
    return this.topics[this.selection];
}

Grid.prototype.select = function(i){
    this.selection = i;
    this.topics[i].select();
}

Grid.prototype.clearSelection = function(){
    var s = this.getSelection();
    if(s) s.deselect();
}

Grid.prototype.addTopic = function(t){
    var self = this;

    self.topics.push(t);

    t.on('click', function(t){
        self.topicClicked(t);
    });
}

Grid.prototype.topicClicked = function(t){
    this.clearSelection();
    this.select(this.topics.indexOf(t));
}

Grid.prototype.init = function(){
    var self = this;
    
    self.topics = [];

    $.getJSON('api/v1/topics', function(data){
        _.each(data, function(topic){
            topic['sel'] = $('#' + topic._id);
            self.addTopic(new Topic(topic));
        });
        
        self.width = self.topics.length > 4 
            ? 4 : self.topics.length;
            
        self.height = Math.ceil(self.topics.length / 4);
    });
    
    $(document).keyup(function(e){
        self.keyup(e);
    })
}

Grid.prototype.keyup = function(e){
    // Delegate to functions with nice names per keys.js
    if (typeof(this[KEYS[e.keyCode]]) == 'function') {
        this[KEYS[e.keyCode]](e);
    }
}

Grid.prototype.enter = function(e){}

Grid.prototype.escape = function(e){
    this.clearSelection();
}

Grid.prototype.left  = function(e){
    var i = this.selection;
    
    this.clearSelection();
    
    if (i == -1 || i == 0) {
        this.select(i = (this.topics.length-1));
    } else {
        this.select(this.selection = --i);
    }
}

Grid.prototype.right = function(e){
    var i = this.selection;
    
    this.clearSelection();
    
    if (i == (this.topics.length-1)) {
        this.select(0);
    } else {
        this.select(++i);
    }
}

Grid.prototype.up = function(e){
    var i = this.selection;
    
    if (i == -1) {
       this.select(this.topics.length-1);
       return; 
    }
    
    this.clearSelection();
        
    var x = i % this.width,
        y = Math.floor(i/this.width),
        p = i - this.width;
    
    if (p < 0)
        p = i+(this.width*(y+1));
    
    if (p >= this.topics.length)
        p = x*(this.height-1);

    this.select(p);
}

Grid.prototype.down = function(e){
    var i = this.selection;
    
    if (i == -1) {
       this.select(0);
       return; 
    }
    
    this.clearSelection();
        
    var x = i % this.width,
        y = Math.floor(i/this.width),
        p = i + this.width;

    if (p >= this.topics.length)
        p = x;
    
    this.select(p);
}

var grid = new Grid();

$(document).ready(function(){
    grid.init();
});