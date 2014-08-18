App.MenuController = Ember.ArrayController.extend({

    groups: function() {
        return this.store.find('group');
    }.property()

});