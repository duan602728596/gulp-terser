import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import typescript from 'gulp-typescript';
import terser from '../esm/gulpTerser.js';

function es() {
  return gulp.src(['./src/es.js'])
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(terser({
      terserOptions: {
        ecma: 8
      }
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build'));
}

function ts() {
  const result = gulp.src(['./src/ts.ts'])
    .pipe(sourcemaps.init())
    .pipe(typescript());

  return result.js
    .pipe(terser({
      terserOptions(args) {
        return {
          ecma: 8,
          sourceMap: {
            filename: args.basename
          }
        };
      }
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build'));
}

export default gulp.parallel(es, ts);