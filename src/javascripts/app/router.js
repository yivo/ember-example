App.Router.map(function() {

    this.resource('contacts', function() {
        this.route('new');
        this.route('edit', { path: '/edit/:id' });
    });

});