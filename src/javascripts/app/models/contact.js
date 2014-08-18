App.Contact = DS.Model.extend({
    name: DS.attr('string'),
    phone: DS.attr('string'),
    photo: DS.attr('string'),
    groups: DS.hasMany('group')
});

App.Contact.FIXTURES = [
    { id: 1, name: 'Brian', phone: '999-999-999', groups: [1], photo: '/images/brian.jpg' },
    { id: 2, name: 'Stewie', phone: '999-999-999', groups: [2], photo: '/images/stewie.gif' }
];