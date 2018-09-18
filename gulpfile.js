const path = require('path');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('./lib/index');

function es(){
  return gulp.src('./test/src/es.js')
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./test/build'))
}

gulp.task('default', es);