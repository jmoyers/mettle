function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: { value: ctor, enumerable: false }
    });
}

function exists(v, def){
    def = _.defaults(def, false);
    return typeof( v ) != "undefined"
        ? v
        : def;
}
