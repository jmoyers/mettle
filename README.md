Model
===========

Arbitrary property tracking
------

    // run time extension, track all attributes that are passed in
    person = new Model({
      name    : 'josh',
      location: 'sf',
      phone   : 'phone',
      status  : 'reddit is a black hole'
    })

    // if no id is passed in, a guid will be assigned
    console.log('my automatically assigned id: ', person.id);


Ordered middleware - generic/property specific
----------

    // generic ordered middleware
    person.use(function(attribs, cb){
      // html entity encode all attributes before commit
      for (var key in attribs) {
        attribs[key] = sanitize(attribs[key]).entityEncode()
      }

      // pass modified attributes to next middleware
      cb(attribs)
    });
    
    person.use(function(attribs, cb){
      // All attributes will be entityEncoded
      console.log(attribs)
      cb(attribs)
    });
    
    // Fire and forget setter
    person.status = '<a href="twitter.com/joshuamoyers">My Twitter</a>';
    // person.status will be '&lt;a href=&quot;twitter.com/joshuamoyers&quot;&gt;My Twitter&lt;/a&gt;'
    
    // property specific middleware
    person.use('name', function(val, cb){
      // make sure we're a string, and force to lower case
      cb(val.toString().toLowerCase());
    });

    person.name = 'JOSH';
    // person.name will be 'josh'

Output:
    { id: '40c4d5f3-5937-422e-b1de-8ed03faf9584',
      name: 'josh',
      location: 'sf',
      phone: 'phone',
      status: '&lt;a href=&quot;twitter.com/joshuamoyers&quot;&gt;My Twitter&lt;/a&gt;' }

Change events - generic/property specific      
      // generic property change events
      person.on('change', function(attribs){
        console.log('attributes after middleware applied (change event):');
        console.log(attribs);
        console.log('')
      });

      person.on('name.change', function(val){
        // Any time the name property changes, we get access to its value here
        // middleware has been applied at this point
        console.log('a new name was committed: ', val)
      });
      
      person.name = 'Yolanda';

Output
    attributes after middleware applied (change event):
    { id: '40c4d5f3-5937-422e-b1de-8ed03faf9584',
      name: 'Yolanda',
      location: 'sf',
      phone: 'phone',
      status: '&lt;a href=&quot;twitter.com/joshuamoyers&quot;&gt;My Twitter&lt;/a&gt;' }

    a new name was committed:  Yolanda
    
Long form setter and multi-set (one change event)
-----------    

    person.set('name', 'joshua Moyers', function(attributes){
      // All middleware has been applied, change events have been fired
      console.log('long form setter callback:');
      console.log(attributes);
      console.log('')
    });

    // Multi set (one change event fired)
    person.set({
      name  : 'Joshua',
      status: 'Hmmmm'
    })

Output:

    long form setter callback:
    { id: '40c4d5f3-5937-422e-b1de-8ed03faf9584',
      name: 'joshua moyers',
      location: 'sf',
      phone: 'phone',
      status: '&lt;a href=&quot;twitter.com/joshuamoyers&quot;&gt;My Twitter&lt;/a&gt;' }

    attributes after middleware applied (change event):
    { id: '40c4d5f3-5937-422e-b1de-8ed03faf9584',
      name: 'joshua',
      location: 'sf',
      phone: 'phone',
      status: 'Hmmmm' }