App.ContactFormController = Ember.ObjectController.extend({

    name: Ember.computed.oneWay('model.name'),

    needs: 'contacts',

    actions: {
        saveContact: function() {
            var contact = this.get('model') || this.store.createRecord('contact');
            contact.set('name', this.get('name'));

            var groupName = this.get('controllers.contacts.group');
            if (!groupName) {
                var promise = this.store.find('group', { name: groupName });
                promise.then(function(groups) {
                    var group = groups.get('firstObject');
                    if (group) contact.get('groups').push(group);
                });
            }

            contact.save();
            return true;
        }
    }

});