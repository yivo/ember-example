var App = Ember.Application.create({
    LOG_TRANSITIONS: true,
    LOG_VIEW_LOOKUPS: true
});

var RESTAdapter = DS.RESTAdapter.extend({

    buildURL: function() {
        console.log(this.get('options'));
        return 'ru' + this._super.apply(this, arguments);
    }

});

var FixtureAdapter = DS.FixtureAdapter.extend({
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

//App.ApplicationStore = DS.Store.extend({
//    adapter: RESTAdapter
//});
//
//// Define your class and apply the Mixin
//User = Ember.Object.extend({});
//User.reopenClass(Discourse.Singleton);
//
//// Retrieve the current instance:
//var instance = User.current();

/**
 * @link http://balinterdi.com/2014/05/01/dependency-injection-in-ember-dot-js.html
 */
App.initializer({

    name: 'injectOptions',

    initialize: function(container, app) {
        container.optionsForType('globals', { instantiate: false, singleton: true });
        container.register('globals:options', Ember.Object.create());

        container.typeInjection('controller', 'options', 'globals:options');
        container.typeInjection('route', 'options', 'globals:options');
    }

});