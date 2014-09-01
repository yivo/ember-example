var gulp = require('gulp');
var helpers = require('./helpers.js');
var extensions = {
    clean: 'gulp-clean',
    concat: 'gulp-concat',
    connect: 'gulp-connect',
    rename: 'gulp-rename',
    preprocess: 'gulp-preprocess'
};

var src = helpers.src;
var vendor = helpers.vendor;
var app = helpers.app;
var e = helpers.extension(extensions);

gulp.task('js.app', function() {
    return gulp.src(src.js.list)
        .pipe(e('concat')('application.js'))
        .pipe(gulp.dest(app.js.root));
});

gulp.task('js.vendor', function() {
    return gulp.src(vendor.js)
        .pipe(e('concat')('vendor.js'))
        .pipe(gulp.dest(app.js.root));
});

gulp.task('css.app', function() {
    return gulp.src(src.css.list)
        .pipe(e('concat')('application.css'))
        .pipe(gulp.dest(app.css.root));
});

gulp.task('css.vendor', function() {
    return gulp.src(vendor.css)
        .pipe(e('concat')('vendor.css'))
        .pipe(gulp.dest(app.css.root));
});

gulp.task('html.templates', [
    'html.templates.collect',
    'html.templates.preprocess'
], function() {
    return gulp.start('html.templates.cache.clean');
});

gulp.task('html.templates.preprocess', ['html.templates.collect'], function() {
    return gulp.src(src.html.list)
        .pipe(e('preprocess')())
        .pipe(gulp.dest(app.html.root));
});

gulp.task('html.templates.collect', function() {
    return gulp.src(src.html.templates.list)
        .pipe(e('concat')(src.html.templates.cache.name))
        .pipe(gulp.dest(src.html.templates.cache.root));
});

gulp.task('images', function() {
    return gulp.src(src.images.list)
        .pipe(gulp.dest(app.images.root));
});

gulp.task('clean', function() {
    return gulp.src([
        app.root,
        src.html.templates.cache.file
    ], { read: false }).pipe(e('clean')());
});

gulp.task('html.templates.cache.clean', function() {
    return gulp.src(src.html.templates.cache.file, { read: false }).pipe(e('clean')());
});

gulp.task('watch', ['clean'], function() {
    gulp.watch(src.js.root + '**/*.js', ['js.app']);
    gulp.watch(src.css.root + '**/*.css', ['css.app']);

    gulp.watch(vendor.root + '**/*.js', ['js.vendor']);
    gulp.watch(vendor.root + '**/*.css', ['css.vendor']);

    gulp.watch([
            src.html.root + '*.html',
            src.html.templates.root + '**/*.html'
    ], ['html.templates']);
    gulp.watch(src.images.root + '**/*', ['images']);
});

gulp.task('server', function() {
    e('connect').server({
        root: 'public',
        port: 4000,
        livereload: true
    });
});

gulp.task('default', function() {
    return gulp.start('build', 'server', 'watch');
});

gulp.task('build', ['clean'], function() {
    return gulp.start('html.templates', 'js.app', 'js.vendor', 'css.app', 'css.vendor', 'images');
});