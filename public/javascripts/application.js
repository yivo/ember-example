var App = Ember.Application.create({
    LOG_TRANSITIONS: true,
    LOG_VIEW_LOOKUPS: true
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

    this.resource('contacts', function() {
        this.route('new');
        this.route('edit', { path: '/edit/:id' });
    });

});
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

    model: function() {
        return this.store.find('contact');
    },

    renderTemplate: function(controller, model) {
        this.controllerFor('contacts').set('content', model);
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

    queryParams: ['group', 'q'],
    group: '',
    q: ''

});
App.IndexController = Ember.ArrayController.extend({

});
App.MenuController = Ember.ArrayController.extend({

    groups: function() {
        return this.store.find('group');
    }.property()

});
App.Contact = DS.Model.extend({
    name: DS.attr('string'),
    phone: DS.attr('string'),
    photo: DS.attr('string'),
    groups: DS.hasMany('group')
});

App.Contact.FIXTURES = [
    { id: 1, name: 'Brian', phone: '999-999-999', groups: [1], photo: '/images/brian.jpg' },
    { id: 2, name: 'Stewie', phone: '999-999-999', groups: [2], photo: '/images/stewie.gif' }
];
App.Group = DS.Model.extend({
    name: DS.attr('string'),
    contacts: DS.hasMany('contact', { async: true })
});

App.Group.FIXTURES = [
    { id: 1, name: 'Humans', contacts: [2] },
    { id: 2, name: 'Dogs', contacts: [1] }
];