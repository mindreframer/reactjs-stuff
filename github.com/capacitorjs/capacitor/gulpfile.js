var path = require('path');
var gulp = require('gulp');
var clean = require('gulp-clean');

var config = {
  mainScript: 'index.js',
  examples: ['examples/chat/chat.js'],
  assets: ['examples/**/*.{css,png,jpg,gif,svg,ttf,otf,woff}'],
  html: ['examples/**/*.html'],
  scripts: ['index.js', 'src/**/*.js'],
  dist: path.resolve(__dirname, 'dist'),
  tests: ['test/**/*spec.js']
};


// ****************** BUILD TASKS *****************

/*
 *  clean: cleans the dist/ folder
 */
gulp.task('clean', function() {
  gulp.src(config.dist, {read: false})
    .pipe(clean());
});

/*
 *  assets: copies static assets to dist/
 */
gulp.task('html', require('./gulp/html')(config.html, config.dist));

/*
 *  browserify: compile index.js to dist/index.js
 *  default is no source maps & minified output
 *
 *  options:
 *    --debug: enable source maps & prevent minification
 */
gulp.task('browserify', require('./gulp/watchify')(config.mainScript, config.dist));

/*
 *  browserify:example: compile example scripts to dist/
 *  default is no source maps & minified output
 *
 *  options:
 *    --debug: enable source maps & prevent minification
 */
gulp.task('browserify:examples', require('./gulp/watchify')(config.examples, config.dist));

gulp.task('browserify:watch', require('./gulp/watchify')(config.examples, config.dist, true));

/*
 *  jshint: output linting results for the app. note that this includes
 *  linting on compiled .jsx files
 */
gulp.task('jshint', require('./gulp/jshint')(config.scripts));

/*
 *  watch: watches and rebuilds on change
 */
gulp.task('watch', function() {
  gulp.watch(config.scripts, ['jshint']);
});

/*
 *  server: static http and livereload server
 */
gulp.task('server', require('./gulp/server').listen(config.dist));


// ****************** MAIN TASKS *****************

/*
 *  build: build the application
 *    production: NODE_ENV=production gulp build
 *    dev: NODE_ENV=development gulp build --debug
 *    test: NODE_ENV=test gulp build --debug
 */
gulp.task('build', ['jshint', 'browserify', 'browserify:examples', 'html']);

gulp.task('start', ['build', 'watch', 'browserify:watch']);

/*
 *  default => build
 */
gulp.task('default', ['build']);
