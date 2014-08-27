var gulp = require('gulp');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var minify_css = require('gulp-minify-css');

gulp.task('default', ['sass']);

gulp.task('clean', function() {
  return gulp.src('public', { read: false })
             .pipe(clean());
});

gulp.task('sass', ['clean'], function () {
  gulp.src('private/scss/*.scss')
      .pipe(sass())
      .pipe(minify_css())
      .pipe(gulp.dest('public/css'));
});

