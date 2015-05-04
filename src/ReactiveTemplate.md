### ReactiveTemplate

```
Template.__checkName("example");
Template["example"] = new Template("Template.example", (function() {
    var view = this;
    return HTML.DIV({
        style: "width: 200px; height: 200px; background: red;"
    }, "\n        ", Blaze.View(function() {
        return Spacebars.mustache(view.lookup("session"));
    }), "\n    ");
}));

Meteor.startup(function(){
    Session.set('session', 'value');

    var Engine              = require('famous/core/Engine');
    var Modifier            = require('famous/core/Modifier');
    var Transform           = require('famous/core/Transform');
    var RenderNode          = require('famous/core/RenderNode');

    // dont forget this
    famodev.helpers;
    var ReactiveTemplate    = famodev.ReactiveTemplate;

    var mainContext = Engine.createContext();

    var sur = new ReactiveTemplate({
        properties: {
            textAlign: 'center',
            color: 'white',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontWeight: '200',
            fontSize: '16px',
            lineHeight: "200px"
        },
        template: Template.example,
        data: function () {
            return {
                session: Session.get('session')
            };
        }
    });

    var mod = new Modifier({
        origin: [.5, .5]
    });

    sur.on('rendered', function(){
        console.log('rendered');
    });

    sur.on('destroyed', function(){
        console.log('destroyed');
    });

    sur.on('changed', function(data){
        console.log(data);
        mod.setTransform(Transform.translate(10, 0, 0), {duration: 500, curve: "easeIn"});
    });

    var node = new RenderNode(sur);

    mainContext.add(mod).add(node);

    Meteor.setTimeout(function(){
        Session.set('session', 'value2');

        Meteor.setTimeout(function(){
            node.set(new RenderNode());

            Meteor.setTimeout(function(){
                Session.set('session', 'value23');
                node.set(sur);
            }, 1000);

        }, 1000);

    }, 1000);
});
```