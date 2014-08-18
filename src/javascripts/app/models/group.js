App.Group = DS.Model.extend({
    name: DS.attr('string'),
    contacts: DS.hasMany('contact', { async: true })
});

App.Group.FIXTURES = [
    { id: 1, name: 'Humans', contacts: [2] },
    { id: 2, name: 'Dogs', contacts: [1] }
];