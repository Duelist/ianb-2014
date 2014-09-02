var del = require('del'),
    gulp = require('gulp');
    sass = require('gulp-sass'),
    minify_css = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    streamify = require('gulp-streamify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    paths = {
      styles: 'private/styles/*.scss',
      scripts: 'private/scripts/*.js'
    };

gulp.task('default', ['styles', 'scripts']);

gulp.task('clean', function (callback) {
  del('public', callback);
});

gulp.task('styles', ['clean'], function () {
  return gulp.src(paths.styles)
         .pipe(sass())
         .pipe(minify_css())
         .pipe(gulp.dest('public/styles'));
});

gulp.task('scripts', ['clean'], function () {
  return browserify('./private/scripts/main.js', { debug: true })
         .bundle()
         .pipe(source('main.js'))
//         .pipe(streamify(uglify()))
         .pipe(gulp.dest('public/scripts'));
});

