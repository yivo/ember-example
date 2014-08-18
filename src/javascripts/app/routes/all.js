App.ContactsRoute = Ember.Route.extend({

    model: function(o) {

        if (!o.group) {
            return this.store.find('contact');
        }

        var defer = Ember.RSVP.defer();
        var promise = this.store.find('group', { name: o.group });

        promise.then(function(groups) {
            var group = groups.get('firstObject');
            defer.resolve(group ? group.get('contacts') : []);
        });

        return defer.promise;
    },

    actions: {
        queryParamsDidChange: (function() {
            var firstTime = true;
            return function() {
                if (firstTime) {
                    firstTime = false;
                } else {
                    Ember.run.debounce(this, this.refresh, 50);
                }
            };
        })()
    }
});

App.IndexRoute = App.ContactsRoute.extend({

    renderTemplate: function(controller, model) {
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

