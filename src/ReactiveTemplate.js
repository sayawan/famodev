/**
 * ReactiveTemplate
 *     Display content with meteor template.
 *
 * @constructor
 * @extends {famous/core/Surface}
 * @status v0.3.0
 */
define(function(require, exports, module){

    var Surface             = require('famous/core/Surface');

    function ReactiveTemplate (options){
        Surface.apply(this, arguments);
        if ( !isTemplate(options.template) )
            throw new Error("Component required here");
        // https://github.com/meteor/meteor/blob/a81fbf483efa4f40ea2d382f0c7275d408536e96/packages/blaze/view.js#L196
        if (options.template.isCreated)
            throw new Error("Can't render the same View twice");

        this._template = options.template;

        if (typeof options.data !== 'function') {
            this._data = function() { return options.data; };
        } else {
            this._data = options.data;
        }
    }
    ReactiveTemplate.prototype = Object.create(Surface.prototype);

    /**
     * Functions
     */

    /**
     * Methods
     */
    var cleanup = ReactiveTemplate.prototype.cleanup;
    _.extend(ReactiveTemplate.prototype, {
        constructor: ReactiveTemplate,
        /**
         * @method setContent
         */
        setContent: function setContent() {},
        /**
         * Render and insert the UI component into the DOM.
         *
         * @private
         * @method deploy
         * @param {Node} target document parent of this container
         */
        deploy: function deploy(target) {
            var self = this;
            // inplement hooks
            // https://github.com/meteor/meteor/commit/24e3c3e0e1d363b28e87cfd2d2e499048d4f8091
            // ???
            self._stop();
            self._rangeUpdater = Tracker.autorun(function (c) {
                var data;
                if(_.isFunction(self._data))
                    data = self._data();
                if (! c.firstRun)
                    self.emit('changed', data);
            });
            self._blazeView = UI.renderWithData(self._template, self._data, target);
            self.emit('rendered');
        },
        //wrap up cleanup method
        cleanup: function (allocator) {
            this._stop();
            this.emit('destroyed');
            cleanup.call(this, allocator);
        },
        _stop: function () {
            if(this._rangeUpdater && this._rangeUpdater.stop){
                this._rangeUpdater.stop();
                this._rangeUpdater = null;
            }
        },
        /**
         * Remove the UI component from the DOM via jQuery, Blaze will cleanup.
         *
         * @private
         * @method recall
         */
        recall: function recall(target) {
            $(target).empty();
        }
    });

    module.exports = ReactiveTemplate;
});