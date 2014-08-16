var api = {};

api.extension = function(extensions) {
    var cache = {};
    return function(ext) {
        return cache[ext] || (cache[ext] = require(extensions[ext]));
    };
};

String.prototype.rootOf = function(root) {
    return this.charAt(0) === '!' ? '!' + root + this.slice(1) : root + this;
};

Array.prototype.rootOf = function(root) {
    return this.map(function(path) {
        return path.rootOf(root);
    });
};

var src = {}, vendor = {}, app = {};

api.src = src;
api.vendor = vendor;
api.app = app;

module.exports = api;

src.root = 'src/';
src.js = { root: src.root + 'javascripts/' };
src.css = { root: src.root + 'stylesheets/' };
src.images = { root: src.root + 'images/' };
src.html = { root: src.root };
src.html.templates = { root: src.html.root + 'templates/' };
src.html.templates = {
    cache: {
        root: src.html.templates.root,
        name: 'all.html'
    },
    list: ['**/*'].rootOf(src.html.templates.root)
};
src.html.templates.cache.file = src.html.templates.cache.name.rootOf(src.html.templates.cache.root);

src.js.list = [
    'app.js',
    'router.js',
    'routes/**/*.js',
    '**/*.js'
].rootOf(src.js.root);

src.css.list = [
    'styles.css'
].rootOf(src.css.root);

src.images.list = ['**/*'].rootOf(src.images.root);

src.html.list = ['index.html'].rootOf(src.html.root);

vendor.root = 'bower_components/';
vendor.js = [
    'jquery/dist/jquery.js',
    'handlebars/handlebars.js',
    'ember/ember.js',
    'ember-data/ember-data.js'
].rootOf(vendor.root);
vendor.css = ['no.css'].rootOf(vendor.root);

app.root = 'public/';
app.js = { root: app.root + 'javascripts/' };
app.css = { root: app.root + 'stylesheets/' };
app.images = { root: app.root + 'images/' };
app.html = { root: app.root };