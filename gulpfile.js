const gulp = require('gulp');
const sass = require('gulp-sass');
// const concat = require('gulp-concat');
const connect = require('gulp-connect');
const autoprefixer = require('gulp-autoprefixer');
const ghPages = require('gulp-gh-pages');

gulp.task('sass', function() {
  return gulp.src('sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('css'));
});

gulp.task('styles', ['sass'], function() {
  return gulp.src([
      'css/main.css'
    ])
    .pipe(gulp.dest('css'))
    .pipe(connect.reload());
});

gulp.task('scripts', function() {
  return gulp.src([
      'scripts/**/*.js'
    ])
    .pipe(gulp.dest('js'))
    .pipe(connect.reload());
});

gulp.task('html', function() {
  gulp.src('index.html')
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch('index.html', ['html']);
  gulp.watch('scripts/**/*.js', ['scripts']);
  gulp.watch('sass/**/*.scss', ['styles']);
});

gulp.task('connect', function() {
  connect.server({ livereload: true });
});

gulp.task('deploy', ['scripts', 'styles'], function() {
  gulp.src([
    'js/index.js',
    'css/main.css',
    'img/*',
    'fonts/*',
    'index.html',
    'favicon.ico'
  ], { base: './' })
    .pipe(ghPages());
});

gulp.task('default', ['connect', 'watch', 'scripts', 'styles']);