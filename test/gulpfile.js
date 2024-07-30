const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
// eslint-disable-next-line import/no-unresolved
const terser = require('../dist/cjs');

function es() {
  return gulp.src(['./src/es.js'])
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(terser({
      ecma: 8
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build'));
}

exports.default = es;