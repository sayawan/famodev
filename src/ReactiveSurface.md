### ReactiveSurface

```
Meteor.startup(function() {
    Items = new Meteor.Collection('items',{
        connection: null
    });
    Items.insert({
        _id: 'test',
        text: 'cookie'
    });

    var ReactiveSurface = famodev.ReactiveSurface;
    var Engine          = famous.core.Engine;
    var Modifier        = famous.core.Modifier;
    var Transform       = famous.core.Transform;

    var mainContext = Engine.createContext();

    var sur = new ReactiveSurface({
        size: [200, 200],
        properties: {
            textAlign: 'center',
            color: 'white',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontWeight: '200',
            fontSize: '16px',
            lineHeight: "200px",
            background: 'red'
        },
        content: function(){
            return Items.findOne('test').text;
        }
    });

    var mod = new Modifier({
        origin: [.5, .5]
    });

    sur.on('changed', function(data){
        console.log(data);
        mod.setTransform(Transform.translate(10, 0, 0), {duration: 500, curve: "easeIn"});
    });

    mainContext.add(mod).add(sur);

    Meteor.setTimeout(function(){
        Items.update('test', {$set: {text: 'cookie 2'}});
    }, 1000);
});
```