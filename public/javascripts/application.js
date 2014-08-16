App = Ember.Application.create({
    LOG_TRANSITIONS: true
});

App.Store = DS.Store.extend({
    adapter: DS.RESTAdapter.create()
});
App.BaseView = Ember.View.extend({

});
App.Router.map(function() {
    this.resource('contacts');
});
App.ContactsRoute = Ember.Route.extend({

});
App.IndexRoute = Ember.Route.extend({

});
App.IndexController = Ember.Controller.extend({

});
App.ContactsView = App.BaseView.extend({

});
App.IndexView = App.BaseView.extend({

});