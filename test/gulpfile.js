const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const terser = require('../lib/index');

function es(){
  return gulp.src(['./src/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(terser({
      ecma: 8
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build'));
}

gulp.task('default', es);