const { src, dest, series, parallel, watch, task } = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const header = require('gulp-header');
const pkg = require('./package.json');

/* Set banner for dist files */
const setBanner = () => {
	const banner = [
    '/**',
    ` * Judo Spin`,
    ` * @name        ${pkg.name}`,
    ` * @description ${pkg.description}`,
    ` * @link        ${pkg.homepage}`,
    ` * @author      ${pkg.author.name}, ${pkg.author.web}`,
    ` * @version     v${pkg.version}`,
    ` * @created     July 22, 2023`,
    ` * @updated     August 04, ${new Date().getFullYear()}`,
    ` * @copyright   Copyright (C) 2023-${new Date().getFullYear()}, ${pkg.author.name}`,
    ` * @license     ${pkg.license}`,
    ` * @licenseMIT  ${pkg.homepage}/blob/main/LICENSE`,
    ` * @demoExample https://rodgath.github.io/judo-spin/demo/`,  
    ' */',
    ''
  ].join('\n');
  
	return src('./dist/{css,js}/**/*.{js,css}')
  .pipe(header(banner))
  .pipe(dest('./dist'))
}

/* Set banner task */
task('set:banner', () => setBanner());

const compressJs = () => {
  return src('src/*.js')
        .pipe(dest('./demo/js')) // Send original script file to /demo
        .pipe(dest('./dist/js')) // Send original script file to /dist
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(rename( { suffix: '.min' } ))
        .pipe(dest('./demo/js'))
        .pipe(dest('./dist/js'))
}

const watchTask = () => {
  watch(['./src/*.js', './demo/*.html'], { events: 'all' }, series(compressJs, setBanner))
}

const buildTask = () => {
  return series(compressJs, setBanner)
}

task('compress:js', compressJs);

task('watch', watchTask);

task('build', buildTask);

exports.default = buildTask();