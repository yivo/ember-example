App.ContactsRoute = Ember.Route.extend({

    queryParams: {
        group: { refreshModel: true },
        q: { refreshModel: true }
    },

    model: function(o) {
        if (!o.group) {
            return this.store.findAll('contact');
        }

        var defer = Ember.RSVP.defer();
        var promise = this.store.find('group', { name: o.group });

        promise.then(function(groups) {
            var group = groups.get('firstObject');
            Ember.run.later(defer.resolve.bind(defer, group ? group.get('contacts') : []), 300);
        });

        return defer.promise;
    }

});

App.IndexRoute = Ember.Route.extend({

    controllerName: 'contacts',

    queryParams: {
        q: { refreshModel: true }
    },

    model: function() {
        return this.store.find('contact');
    },

    renderTemplate: function(controller, model) {
        controller.set('content', model);
        this.render('contacts');
    }

});

App.ContactsModalForm= Ember.Route.extend({

    templateName: 'contacts/new',

    actions: {
        saveContact: function() {
            this.transitionTo('contacts', {
                queryParams: { q: undefined }
            });
        }
    },

    renderTemplate: function() {
        return this.render(this.templateName, {
            into: 'application',
            outlet: 'modal'
        });
    }
});

App.ContactsNewRoute = App.ContactsModalForm.extend({});

App.ContactsEditRoute = App.ContactsModalForm.extend({
    templateName: 'contacts/edit',
    model: function(o) {
        return this.store.find('contact', o.id);
    }
});