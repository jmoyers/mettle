function log(){
    return console.log.apply( console, arguments );
}

module = typeof(module) == 'undefined'
    ? {}
    : module;
    
module.exports = log;