var gulp = require('gulp');
var embedlr = require('gulp-embedlr');
var gulpif = require('gulp-if');

var options = {
  port: 35729,
  src: "' + (location.protocol || 'http:') + '//' + ('127.0.0.1') + ':" + 35729 + "/livereload.js?snipver=1"
};

module.exports = function(src, dest) {
  return function() {
    gulp.src(src)
      .pipe(gulpif(process.env.NODE_ENV === 'development', embedlr(options)))
      .pipe(gulp.dest(dest));
  }
}