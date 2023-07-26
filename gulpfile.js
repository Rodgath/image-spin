const { src, dest, series, parallel, watch, task } = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const rename = require('gulp-rename');

const compressJs = () => {
  return src('src/*.js')
          .pipe(babel({
              presets: ['@babel/env']
          }))
          .pipe(uglify())
          .pipe(rename( { suffix: '.min' } ))
          .pipe(dest('demo'))
          .pipe(dest('dist'))
}

const watchTask = () => {
  watch(['src/*.js', 'demo/*.html'], { events: 'all' }, compressJs)
}

task('compress:js', compressJs);

task('watch', watchTask);