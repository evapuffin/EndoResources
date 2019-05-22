var gulp = require('gulp');
var path = require('path');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var connect = require('gulp-connect');
var open = require('gulp-open');

var Paths = {
  HERE: './',
  HTML: './*.html',
  Pages: './*.html',
  Navs: './page_navs/*.html',
  DIST: 'dist/',
  CSS: './assets/css/',
  JS: './assets/js/*.js',
  SCSS_TOOLKIT_SOURCES: './assets/scss/material-kit.scss',
  SCSS: './assets/scss/**/**',
};

gulp.task('compile:scss', function () {
  return gulp.src(Paths.SCSS_TOOLKIT_SOURCES)
    .pipe(sourcemaps.init({ largeFile: true }))
    .pipe(sourcemaps.identityMap())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write(Paths.HERE))
    .pipe(gulp.dest(Paths.CSS))
    .pipe(connect.reload());
});
gulp.task('refresh-html', function () {
  return gulp.src(Paths.HTML)
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(Paths.SCSS, ['compile:scss']);
  gulp.watch(Paths.JS, ['compile:scss']);
  gulp.watch(Paths.Pages, ['refresh-html']);
  gulp.watch(Paths.Navs, ['refresh-html']);
});

gulp.task('server', function () {
  connect.server({
    port: 9001,
    livereload: true
  });
});

gulp.task('default', ['server', 'watch'], function () {
  gulp.src(__filename)
    .pipe(open({
      uri: 'http://localhost:9001/index.html'
    }));
});