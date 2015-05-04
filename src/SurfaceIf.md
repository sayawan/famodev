### SurfaceIf

```
Meteor.startup(function () {
    Session.set('surfaceIf', false);

    var mainContext = Engine.createContext();

    var mod = new Modifier({
        align: [0.5, 0.5],
        origin: [0.5, 0.5]
    });

    var _surface = new SurfaceIf({
        modifier: mod,
        condition: function () {
            if (Session.get('surfaceIf')) return true;
            else return false;
        },
        contentBlock: function () {
            return '1010101';
        },
        elseContentBlock: function () {
            return '0000000';
        },
        size: [120, 120],
        classes: ['filterIcon'],
        properties: {
            color: 'white',
            backgroundColor: '#FA5C4F',
            lineHeight: '120px',
            textAlign: 'center'
        }
    });

    _surface.on('click', function () {
        if (!Session.get('surfaceIf')) Session.set('surfaceIf', true);
        else Session.set('surfaceIf', false);
    });

    _surface.on('changed', function (data) {
        console.log(data);
        var mod = this.getModifier();
        mod.beforeSetContent(function (cb) {
            this.setOpacity(0.25, {
                duration: 500,
                curve: "easeIn"
            }, cb);
        });
        mod.afterSetContent(function () {
            this.setOpacity(1, {
                duration: 500,
                curve: "easeIn"
            });
        });
        this.runEffect(data);
    }.bind(_surface));

    _surface.on('rendered', function(){
        console.log('rendered');
    });

    _surface.on('destroyed', function(){
        console.log('destroyed');
    });

    var node = new RenderNode(_surface);

    // test delete
    Meteor.setTimeout(function(){
        node.set(new RenderNode());
        // re add
        Meteor.setTimeout(function(){
            Session.set('surfaceIf', true);
            node.set(_surface);
        }, 1000);

    }, 1000);

    mainContext.add(mod).add(node);
});
```