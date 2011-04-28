var Event = {
    listeners:{
        "type": [],
        "type_id": []
    },
    notify: function( signature, payload ){
        signature = _.defaults( signature, 
            { type  : '' 
            , id    : ''
        });
                    
        var id      = signature.id,
            type    = signature.type;
        
        if( id ) {
            var listeners = this.getListenersByTypeAndId( type, id );
            this.notifyList( listeners, payload );
        }
        
        this.notifyList( this.getListenersByType( type ), payload );
    },
    notifyList: function( list, payload ){
        if( typeof( list ) != "undefined" && jQuery.isArray( list ) ){
            for( var i = 0; i < list.length; i++ ){
                if( list[i].fn(payload) === false ){
                    return;
                }
            }
        }
    },
    getListenersByType: function( type ){
        return exists( type, [] );
    },
    getListenersByTypeAndId: function( type, id ){
        return typeof( this.listeners["type_id"][type + id] ) != "undefined"?this.listeners["type_id"][type + id]:[];
    },
    subscribe: function( type, fn, id ){
        if( typeof( type ) == "undefined" ){ return; }
        if( typeof( id ) == "undefined" ){ id = false; }
        if( id === false ){
            if( !jQuery.isArray( this.listeners["type"][type] ) ){
                this.listeners["type"][type] = [];
            }
            this.listeners["type"][type].push({id: id,fn: fn});
        }
        if( !jQuery.isArray( this.listeners["type_id"][type + id] ) ){
            this.listeners["type_id"][type + id] = [];
        }
        this.listeners["type_id"][type + id].push({id: id,fn: fn});
    },
    unsubscribe: function( type, fn, id ){
        if( typeof( type ) == "undefined" ){ return; }
        if( typeof(  id  ) == "undefined" ){ id = false; }
        if( typeof( this.listeners[type] ) != "undefined" &&
            jQuery.isArray( this.listeners[type] ) ){
            if( id !== false ){
                for( var i = 0; i < this.listeners[type].length; i++ ){
                    if( id == this.listeners[type][i].id && fn == this.listeners[type][i].fn ){
                        this.listeners.splice(i, 1);
                        return;
                    }
                }
            }
            else{
                for( var i = 0; i < this.listeners[type].length; i++ ){
                    if( fn == this.listeners[type][i].fn ){
                        this.listeners.splice(i, 1);
                        return;
                    }
                }
            }
        }
    }
}