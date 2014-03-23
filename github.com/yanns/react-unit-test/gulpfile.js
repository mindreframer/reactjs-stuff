var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var gulpFilter = require('gulp-filter');
var pkg = require('./package.json');
var changed = require('gulp-changed');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');

var react = require('gulp-react');
var mocha = require('gulp-mocha');

var paths = {
    src: './src',
    dest: './public',
    target: './target'
};

var libs = ['react'];

gulp.task('clean', function() {
    gulp.src(paths.dest + '/*.js', {read: false})
        .pipe(clean());

    gulp.src(paths.target, {read: false})
        .pipe(clean());
});

gulp.task('js', function() {
    // package our application
    return gulp.src(paths.src + '/main/app/main.js')
        .pipe(browserify({
            debug: gutil.env.production,
            transform: ['reactify'],

            // do not concat react in our javascript, let it external
            external: libs
        }))
        .pipe(gutil.env.production ? uglify() : gutil.noop())
        .pipe(concat(pkg.name + '.min.js'))
        .pipe(gulp.dest(paths.dest));
});

gulp.task('lib', function () {
  return gulp.src(paths.src + '/main/libs/react.js', { read: false })
             .pipe(browserify({ require: libs }))
             .pipe(gutil.env.production ? uglify() : gutil.noop())
             .pipe(gulp.dest(paths.dest));
});

gulp.task('build', ['js', 'lib']);

gulp.task('test', function () {
    // in test, do not use browserify as we already defined node modules
    var libsFilter = gulpFilter('!**/libs/**/*');
    var mochaFilter = gulpFilter('test/mocha/**/*.js');

    gulp.src([paths.src + '/**/*.js'])

        // transform jsx to js
        .pipe(libsFilter)
        .pipe(react())
        .pipe(libsFilter.restore())

        // copy into target
        .pipe(gulp.dest(paths.target))

        // run mocha
        .pipe(mochaFilter)
        .pipe(mocha({}))
        .on('error', console.warn.bind(console));
});

gulp.task('watch', function() {
    gulp.watch([
        paths.src + '/main/app/**/*.js',
        paths.src + '/test/**/*.js',
    ], ['test', 'js']);
    gulp.watch(paths.src + '/main/libs/**/*.js', ['lib']);
});

gulp.task('default', ['build', 'test', 'watch']);
