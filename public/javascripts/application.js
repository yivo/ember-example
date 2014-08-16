App = Ember.Application.create();

App.Store = DS.Store.extend({
    adapter: DS.RESTAdapter.create()
});
App.Router.map(function() {
    // put your routes here
});
App.IndexRoute = Ember.Route.extend({
    model: function() {
        return ['red', 'yellow', 'blue'];
    }
});