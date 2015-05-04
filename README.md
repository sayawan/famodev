This repo is just clone of [Famodev](https://github.com/particle4dev/famodev) Making it compatible with [Famono](https://github.com/raix/famono) I pull&push items only I need for my project.

Steps to include in your project

in your `lib/smart.require`

```
    "famodev": {
        "path": "https://github.com/sayawan/famodev.git",
        "root": "src"
    },
```

include `famodev` in your template

```
    var ReactiveTemplate = famodev.reactive.ReactiveTemplate;

    var reactive = new ReactiveTemplate({
        template: Template.mytemplate,
        data: Collection.find().fetch(),
        properties: {
        }
    });
```
