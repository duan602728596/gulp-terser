const gulp = require('gulp');
const uglify = require('../index');

function es(){
  return gulp.src('./src/es.js')
    .pipe(uglify({
      ecma: 8,
      warnings: true
    }))
    .pipe(gulp.dest('./build'))
}

gulp.task('default', es);