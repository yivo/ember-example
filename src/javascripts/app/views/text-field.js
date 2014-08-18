Ember.TextField.reopen({

    _deferredSet: function(key, value, delay) {
        return Ember.run.debounce(this, Ember.set, this, key, value, delay);
    },

    _elementValueDidChange: function() {
        var delay = this.get('delay');
        if (delay) {
            return this._deferredSet('value', this.$().val(), delay);
        } else {
            return Ember.set(this, 'value', this.$().val());
        }
    }

});
