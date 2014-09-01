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