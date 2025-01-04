const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack-stream');

const dist = `${__dirname}/../public_html/assets/`;

function compileSass(src, dest, map) {
  return gulp.src(src, { allowEmpty: true })
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.', { sourceRoot: '/src/'+map }))
    .pipe(gulp.dest(dest));
}

function minifyCSS(src, dest, map) {
  return gulp.src(src, { allowEmpty: true })
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(concat(dest))
    .pipe(sourcemaps.write('.', { sourceRoot: '/src/'+map }))
    .pipe(gulp.dest(`${dist}css`));
}

function compileJS(src, dest, fileName, map, webpackFile) {
  return gulp.src(src, { allowEmpty: true })
    .pipe(sourcemaps.init())
    .pipe(webpack(require(webpackFile)))
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(concat(fileName))
    .pipe(gulp.dest(dest))
    .pipe(sourcemaps.write('.', { sourceRoot: '/src/'+map }))
    .pipe(gulp.dest(dest));
}

function minifyJS(src, dist, filename, map) {
  return gulp.src(src, { allowEmpty: true })
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    }) // Handle errors gracefully
    .pipe(concat(filename))
    .pipe(sourcemaps.write('.', { sourceRoot: '/src/'+map }))
    .pipe(gulp.dest(dist));
}

// General Compilation
gulp.task('sass', () => compileSass(__dirname+'/scss/style.scss', `${dist}css`, '/scss'));
gulp.task('minify-css', () => minifyCSS(`${dist}css/style.css`, 'style.min.css', '/scss'));
gulp.task('js', () => compileJS(__dirname+'/js/app.js', `${dist}js`, 'app.js', '/js', './webpack.config.js'));
gulp.task('minify-js', () => minifyJS(`${dist}js/app.js`, `${dist}js`, 'app.min.js', '/js'));

// Watch
function watchFiles() {
  gulp.watch(__dirname+'/scss/**/*.scss', gulp.series('sass', 'minify-css'));
  gulp.watch(__dirname+'/js/**/*.js', gulp.series('js', 'minify-js'));
}

gulp.task('watch', watchFiles);
gulp.task('default', gulp.series('sass', 'js', 'minify-css', 'minify-js', 'watch'));
