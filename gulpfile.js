var gulp = require('gulp'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  jshint = require('gulp-jshint'),
  browserSync = require('browser-sync');

gulp.task('build', function() {
  gulp.src('src/js/*.js')
    .pipe(concat('gr.js'))
    .pipe(gulp.dest('lib'))
    .pipe(rename('gr.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('lib/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('jshint', function() {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', ['browserSync'], function() {
  gulp.watch('src/js/*.js', ['jshint']);
  // Other watchers
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: '.'
    },
  })
});
