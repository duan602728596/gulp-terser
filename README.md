# gulp-uglifyes

Gulp plugin, compressed es6+ code.

## Install
```
$ npm install gulp-uglifyes --save-dev
```
or
```
$ yarn add gulp-uglifyes --dev
```

## How to use
```javascript
const gulp = require('gulp');
const uglify = require('gulp-uglifyes');

function es(){
  return gulp.src('./src/index.js')
    .pipe(uglify())
    .pipe(gulp.dest('./build')) 
}

gulp.task('default', es);
```

## Options
Uglify-es configuration can be viewed [https://github.com/mishoo/UglifyJS2/tree/harmony#minify-options](https://github.com/mishoo/UglifyJS2/tree/harmony#minify-options).
```javascript
const gulp = require('gulp');
const uglify = require('gulp-uglifyes');

function es(){
  return gulp.src('./src/index.js')
    .pipe(uglify({
      warnings: true,
      ecma: 8
    }))
    .pipe(gulp.dest('./build')) 
}

gulp.task('default', es);
```