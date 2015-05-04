### ReactiveTemplate

```
Meteor.startup(function(){
    Items = new Meteor.Collection('items',{
        connection: null
    });
    Items.insert({
        _id: 'test00',
        text: 'cookie00'
    });
    Items.insert({
        _id: 'test01',
        text: 'cookie01'
    });
    Items.insert({
        _id: 'test02',
        text: 'cookie02'
    });
    Items.insert({
        _id: 'test03',
        text: 'cookie03'
    });
    Items.insert({
        _id: 'test04',
        text: 'cookie04'
    });
    Items.insert({
        _id: 'test06',
        text: 'cookie06'
    });

    var reactiveCursor = new famodev.ReactiveCursor({
        data: function(){
            return Items.find({}, {sort: {text: -1}});
        }
    });

    reactiveCursor.on('addedAt', function(data){
        console.log(data, 'addedAt');
    });

    reactiveCursor.on('changedAt', function(data){
        console.log(data, 'changedAt');
    });

    reactiveCursor.on('removedAt', function(data){
        console.log(data, 'removedAt');
    });

    reactiveCursor.on('movedTo', function(data){
        console.log(data, 'movedTo');
    });

    Meteor.setTimeout(function(){
        Items.update('test06', {$set: {text: '06'}});
        Items.insert({
            _id: 'test05',
            text: 'cookie05'
        });
        Items.remove('test03');
        Meteor.setTimeout(function(){
            console.log(reactiveCursor.get());
            reactiveCursor.stop();
        }, 1000);

    }, 1000);
});
```