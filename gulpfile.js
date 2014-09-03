var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');

// Lint
gulp.task('lint', function () {
  gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Compress
gulp.task('compress', function () {
  gulp.src('src/*.js')
    .pipe(gulp.dest('dist/'))
    .pipe(rename(function (path) {
        path.basename += '.min';
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'))
});

// Watch
gulp.task('watch', function () {
  gulp.watch('src/*.js', ['lint', 'compress']);
});

// Default Task
gulp.task('default', function () {
  gulp.start('watch');
});