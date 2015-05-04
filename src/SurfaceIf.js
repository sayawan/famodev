/**
 * Surface If Component
 *      Like {{#if}} components in blaze (meteor)
 *
 * @constructor
 * @extends {famous/core/Surface}
 * @status v0.3.0
 */
define(function(require, exports, module){

    var Surface             = require('famous/core/Surface');
    var ReactiveSession     = require('famodev/reactive/ReactiveSession');

    function SurfaceIf (options) {
        Surface.apply(this, arguments);
        this._reactiveSession = new ReactiveSession({
            data: options.condition
        });
        _setListeners.call(this);
        // private modifier
        this._modifier = options.modifier;
        this.condition = options.condition;
        this.contentBlock = options.contentBlock;
        this.elseContentBlock = options.elseContentBlock;

        // set content first time
        var content, condition = this.getContent();
        if(condition == '')
            condition = this.condition();
        if(condition) {
            content = this.contentBlock();
        }
        else {
            content = this.elseContentBlock();
        }
        this.setContent(content);
    }
    SurfaceIf.prototype = Object.create(Surface.prototype);

    /**
     * Functions
     */
    function _setListeners () {
        this._reactiveSession.on('changed', function(value){
            this.emit('changed', value);
        }.bind(this));
    }

    /**
     * Methods
     */
    var cleanup = SurfaceIf.prototype.cleanup;
    var deploy  = SurfaceIf.prototype.deploy;
    _.extend(SurfaceIf.prototype, {
        constructor: SurfaceIf,
        //this function will save content in document.createDocumentFragment();
        //we will not change content if we want it reactive
        recall: function (target) {},
        deploy: function (target) {
            deploy.call(this, target);
            this.emit('rendered');
        },
        getModifier: function(){
            var self = this;
            return {
                beforeSetContent: function(func){
                    self._animateBeforeSetContent = func.bind(self._modifier);
                },
                afterSetContent: function(func){
                    self._animateAfterSetContent = func.bind(self._modifier);
                }
            };
        },
        cleanup: function (allocator) {
            this.emit('destroyed');
            cleanup.call(this, allocator);
        },
        runEffect: function(value){
            var content;
            if(value) {
                content = this.contentBlock();
            }
            else {
                content = this.elseContentBlock();
            }
            if (this._animateBeforeSetContent /** and equal function*/ ) {
                this._animateBeforeSetContent(function () {
                    this._animateBeforeSetContent = null;
                    this.setContent(content);
                    if (this._animateAfterSetContent /** and equal function*/ ) {
                        this._animateAfterSetContent();
                        this._animateAfterSetContent = null;
                    }
                }.bind(this));
            }
            else {
                this.setContent(content);
                if (this._animateAfterSetContent /** and equal function*/ ) {
                    this._animateAfterSetContent();
                    this._animateAfterSetContent = null;
                }
            }
        }
    });

    module.exports = SurfaceIf;

});