App = Ember.Application.create();

App.Store = DS.Store.extend({
    adapter: DS.RESTAdapter.create()
});