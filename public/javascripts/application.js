var App = Ember.Application.create({
    LOG_TRANSITIONS: true
});

App.ApplicationStore = DS.Store.extend({
    adapter: DS.FixtureAdapter.extend({
        queryFixtures: function(fixtures, query, type) {
            return fixtures.filter(function(item) {
                for (var prop in query) {
                    if (item[prop] !== query[prop]) {
                        return false;
                    }
                }
                return true;
            });
        }
    })
});
App.Router.map(function() {

    this.resource('contacts', { path: '/contacts', queryParams: ['group'] }, function() {
        this.route('new');
        this.route('edit', { path: '/edit/:id' });
    });

});
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
App.ContactsController = Ember.ArrayController.extend({

    queryParams: ['group', 'q']

});
App.IndexController = Ember.Controller.extend({

});
App.MenuController = Ember.ArrayController.extend({

    groups: function() {
        return this.store.find('group');
    }.property()

});
App.Contact = DS.Model.extend({
    name: DS.attr('string'),
    phone: DS.attr('string'),
    groups: DS.hasMany('group')
});

App.Contact.FIXTURES = [
    { id: 1, name: 'Bryan', phone: '999-999-999', groups: [1, 2] },
    { id: 2, name: 'Oliver', phone: '999-999-999', groups: 2 }
];
App.Group = DS.Model.extend({
    name: DS.attr('string'),
    contacts: DS.hasMany('contact', { async: true })
});

App.Group.FIXTURES = [
    { id: 1, name: 'Family', contacts: [1] },
    { id: 2, name: 'Friends', contacts: [1,2] }
];
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
