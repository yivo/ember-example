var App = Ember.Application.create({
    LOG_TRANSITIONS: true,
    LOG_VIEW_LOOKUPS: true
});

//// Define your class and apply the Mixin
//User = Ember.Object.extend({});
//User.reopenClass(Discourse.Singleton);
//
//// Retrieve the current instance:
//var instance = User.current();

var RESTAdapter = DS.RESTAdapter.extend({

    primaryKey: '_id',

    buildURL: function() {
        var locale = this.get('options.locale');
        console.log('Locale: %s', locale);
        return locale + this._super.apply(this, arguments);
    }

});

var FixtureAdapter = DS.FixtureAdapter.extend({

    primaryKey: '_id',

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

});

/**
 * @link http://balinterdi.com/2014/05/01/dependency-injection-in-ember-dot-js.html
 * @link http://stackoverflow.com/questions/18209862/how-and-when-to-use-ember-application-register-and-inject-methods
 */
App.initializer({

    name: 'options',

    initialize: function(container, app) {
        var o = Ember.Object.create();
        o.set('default-locale', 'en');
        app.register('globals:options', o, { instantiate: false, singleton: true });
        app.register('data-adapter:main', RESTAdapter);
    }

});

App.initializer({

    name: 'injectOptions',
    before: 'options',

    initialize: function(container, app) {
        app.inject('controller', 'options', 'globals:options'); // OK
        app.inject('route', 'options', 'globals:options'); // OK

        // all below sad
        app.inject('data-adapter', 'options', 'globals:options');
        app.inject('dataAdapter', 'options', 'globals:options');
        app.inject('adapter', 'options', 'globals:options');
        app.inject('adapter', 'options', 'globals:options');
        app.inject('store', 'options', 'globals:options');
    }

});

App.ApplicationStore = DS.Store.extend({
    adapter: RESTAdapter
});
App.Router.map(function() {

    this.resource('contacts', function() {
        this.route('new');
        this.route('edit', { path: '/edit/:id' });
    });

});
App.Route = Ember.Route.extend({
    beforeModel: function(transition) {
        var p = transition.params;
        var defaultLocale = this.get('options.default-locale');
        var locale = p ? p.locale : defaultLocale;
        this.set('options.locale', locale || defaultLocale);

        console.log(this.get('options.locale'));

    }
});

App.ContactsRoute = App.Route.extend({

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

App.IndexRoute = App.Route.extend({

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

App.ContactsModalForm= App.Route.extend({

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