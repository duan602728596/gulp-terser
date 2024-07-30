import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
// eslint-disable-next-line import/no-unresolved
import terser from '../dist/cjs.js';

function buildCode() {
  return gulp.src(['./src/**.js'])
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(terser({
      ecma: 8
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));
}

export default buildCode;