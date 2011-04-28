$(document).ready(function(){
    $(document).keyup();
});

function key_action(e){
    var name = key(e);
    return (typeof(actions[name]) != 'undefined')
        ? actions[name](e)
        : false;
}

var actions = {
    'enter': function(e){
        $('#search')
            .toggle()
            .focus();
    }, 
    'left': function(e){
        
    },
    'right_arrow': function(e){
        console.log('test');
        $('.topic').first().addClass('selected');
    },
    'up': function(e){
        
    },
    'down': function(e){
        
    }
}