App.Contact = DS.Model.extend({
    name: DS.attr('string'),
    phone: DS.attr('string'),
    groups: DS.hasMany('group')
});

App.Contact.FIXTURES = [
    { id: 1, name: 'Bryan', phone: '999-999-999', groups: [1, 2] },
    { id: 2, name: 'Oliver', phone: '999-999-999', groups: 2 }
];