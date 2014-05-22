var gulp = require('gulp');
var jshint = require('gulp-jshint');

module.exports = function(src) {
  return function() {
    gulp.src(src)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
  }
}
