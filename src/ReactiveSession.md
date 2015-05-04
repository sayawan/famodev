### ReactiveSession

```
Meteor.startup(function(){
    Items = new Meteor.Collection('items',{
        connection: null
    });
    Items.insert({
        _id: 'test',
        text: 'cookie'
    });

    var reactiveObject = new famodev.ReactiveSession({
        data: function(){
            return Items.findOne('test').text;
        }
    });
    reactiveObject.on('changed', function(value){
        console.log(">>>>>>>>>> " + value);
    });
    Meteor.setTimeout(function(){
        Items.update('test', {$set: {text: 'cookie 2'}});
    }, 1000);
});
```