App.DelayedInput = Ember.View.extend({

    tagName: 'input',
    attributeBindings: ['name', 'placeholder', 'type'],

    didInsertElement: function() {
        this._super();
        Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
    },

    afterRenderEvent: function() {
        clearTimeout(this.timer);
        this.$().val(this.get('controller.q')).focus();
        this.focusElement();
    },

    setValue: function(value) {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        var self = this;
        this.timer = setTimeout(function() {
            self.get('controller').set('q', value);
        }, 220);
    },

    focusElement: function() {
        var el = this.$()[0];
        if (el.setSelectionRange) {
            var len = this.$().val().length * 2;
            el.setSelectionRange(len, len);
        }
    },

    keyDown: function(e) {
        this.setValue(e.currentTarget.value);
    },

    keyUp: function(e) {
        this.setValue(e.currentTarget.value);
    },

    keyPress: function(e) {
        this.setValue(e.currentTarget.value);
    }

});