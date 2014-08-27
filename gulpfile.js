var gulp = require('gulp');
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    minify_css = require('gulp-minify-css'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream');

gulp.task('default', ['styles', 'scripts']);

gulp.task('clean', function() {
  return gulp.src('./public', { read: false })
             .pipe(clean());
});

gulp.task('styles', ['clean'], function () {
  return gulp.src('./private/styles/*.scss')
         .pipe(sass())
         .pipe(minify_css())
         .pipe(gulp.dest('./public/styles'));
});

gulp.task('scripts', ['clean'], function () {
  return browserify('./private/scripts/main.js', { debug: true })
         .bundle()
         .pipe(source('main.js'))
         .pipe(gulp.dest('./public/scripts'));
});
