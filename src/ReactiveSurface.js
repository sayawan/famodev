/**
 * ReactiveSurface
 *     Display content with reactive data.
 *
 * @constructor
 * @extends {famous/core/Surface}
 * @status v0.3.0
 */
define(function(require, exports, module){

    var Surface             = require('famous/core/Surface');
    var ReactiveSession     = require('famodev/ReactiveSession');

    function ReactiveSurface (options){
        Surface.apply(this, arguments);
        this._reactiveSession = new ReactiveSession({
            data: options.content,
            surface: this
        });
        _setListeners.call(this);
    }
    ReactiveSurface.prototype = Object.create(Surface.prototype);

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
    var cleanup = ReactiveSurface.prototype.cleanup;
    var deploy  = ReactiveSurface.prototype.deploy;
    _.extend(ReactiveSurface.prototype, {
        constructor: ReactiveSurface,
        deploy: function (target) {
            deploy.call(this, target);
            this.emit('rendered');
        },
        //wrap up cleanup method
        cleanup: function (allocator) {
            this.emit('destroyed');
            cleanup.call(this, allocator);
        },
        //this function will save content in document.createDocumentFragment();
        //we will not save content if we want it reactive
        recall: function (target) {
        }
    });

    module.exports = ReactiveSurface;
});
