App = Ember.Application.create({
    LOG_TRANSITIONS: true
});

App.Store = DS.Store.extend({
    adapter: DS.RESTAdapter.create()
});