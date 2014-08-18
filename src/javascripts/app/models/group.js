App.Group = DS.Model.extend({
    name: DS.attr('string'),
    contacts: DS.hasMany('contact', { async: true })
});

App.Group.FIXTURES = [
    { id: 1, name: 'Family', contacts: [1] },
    { id: 2, name: 'Friends', contacts: [1,2] }
];