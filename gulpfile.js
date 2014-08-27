var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('default', ['sass']);

gulp.task('sass', function () {
  gulp.src('private/scss/*.scss')
      .pipe(sass())
      .pipe(gulp.dest('public/css'));
});
