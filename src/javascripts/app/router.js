App.Router.map(function() {

    this.resource('contacts', { path: '/contacts', queryParams: ['group'] }, function() {
        this.route('new');
        this.route('edit', { path: '/edit/:id' });
    });

});