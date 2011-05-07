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

function nice_time(d) {
  var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
  var delta = parseInt((relative_to.getTime() - d) / 1000);
  
  var hours = d.getHours() > 12
    ? d.getHours() - 12
    : d.getHours();

  var ampm = d.getHours() > 12
    ? 'pm'
    : 'am';
 
  if (delta > (48*60*60)) {
    return d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear() + ' ' + hours + ':' + d.getMinutes() + ':' + d.getSeconds() + ampm;
  } else {
    return hours + ':' + d.getMinutes() + ':' + d.getSeconds() + ampm;
  }
  
}

function relative_time(date) {
  var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
  var delta = parseInt((relative_to.getTime() - date) / 1000);
 
  if (delta < 60) {
    return 'less than a minute ago';
  } else if(delta < 120) {
    return 'about a minute ago';
  } else if(delta < (60*60)) {
    return (parseInt(delta / 60)).toString() + ' minutes ago';
  } else if(delta < (120*60)) {
    return 'about an hour ago';
  } else if(delta < (24*60*60)) {
    return 'about ' + (parseInt(delta / 3600)).toString() + ' hours ago';
  } else if(delta < (48*60*60)) {
    return '1 day ago';
  } else {
    return (parseInt(delta / 86400)).toString() + ' days ago';
  }
}

_.templateSettings = {
  interpolate : /\{(.+?)\}/g
};