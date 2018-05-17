const gulp = require('gulp');
const terser = require('../index');

function es(){
  return gulp.src('./src/es.js')
    .pipe(terser({
      ecma: 8,
      warnings: true
    }))
    .pipe(gulp.dest('./build'))
}

gulp.task('default', es);