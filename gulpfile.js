var gulp = require('gulp');

//** 项目发布相关 */
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var usemin = require('gulp-usemin');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var rev = require('gulp-rev');
var del = require('del');
var runSequence = require('run-sequence');
var babel = require('gulp-babel');
var es2015Preset = require('babel-preset-es2015')
var gutil = require('gulp-util');
//var sprite = require('gulp-sprite');

var jshint = require('gulp-jshint');
var yuidoc = require("gulp-yuidoc");

var markdown = require('gulp-markdown');



//** ==================================================== 项目发布 ====================================================*/
var paths = {};
var SRCDIR = './app',
  TMPDIR = './.tmp',
  dist = {
    bbase: './app/vendor/bbase',
    readme: './app',
    UserMangement: ''
  },
  DEBUG = true;


gulp.task('bbase_jquery', function () {
  var source = [
    'src/backbone/BbaseJqueryPre.js',
    'src/Est/Est.source.js',
    'src/vendor/backbone/backbone-debug-est.js',
    'src/vendor/handlebars/handlebars-debug.js',

    'src/handlebars/HandlebarsHelper.js',
    'src/backbone/BbaseApp.js',
    'src/backbone/BbaseUtils.js',
    'src/backbone/BbaseService.js',
    'src/backbone/BbaseSuperView.js',
    'src/backbone/BbaseView.js',
    'src/backbone/BbaseList.js',
    'src/backbone/BbaseItem.js',
    'src/backbone/BbaseCollection.js',
    'src/backbone/BbaseModel.js',
    'src/backbone/BbaseDetail.js',
    'src/backbone/BbaseBootstrap.js',
    'src/backbone/BbaseDirective.js',
    'src/backbone/BbaseStatus.js',
    'src/backbone/BbaseEnd.js'
  ];
  if (DEBUG) {
    return gulp.src(source)
      .pipe(concat('bbase_jquery.min.js'))
      .pipe(gulp.dest(dist.bbase));
  }
  return gulp.src(source)
    .pipe(concat('bbase_jquery.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dist.bbase));
});
gulp.task('bbase_zepto', function () {
  var source = [
    'src/vendor/zepto/deferred.js',
    'src/vendor/zepto/callbacks.js',
    'src/vendor/zepto/selector.js',
    'src/vendor/zepto/hover.js',
    'src/backbone/BbaseZeptoPre.js',
    'src/Est/Est.source.js',
    'src/vendor/backbone/backbone-debug-est.js',
    'src/vendor/handlebars/handlebars-debug.js',

    'src/handlebars/HandlebarsHelper.js',
    'src/backbone/BbaseApp.js',
    'src/backbone/BbaseUtils.js',
    'src/backbone/BbaseService.js',
    'src/backbone/BbaseSuperView.js',
    'src/backbone/BbaseView.js',
    'src/backbone/BbaseList.js',
    'src/backbone/BbaseItem.js',
    'src/backbone/BbaseCollection.js',
    'src/backbone/BbaseModel.js',
    'src/backbone/BbaseDetail.js',
    'src/backbone/BbaseBootstrap.js',
    'src/backbone/BbaseDirective.js',
    'src/backbone/BbaseStatus.js',
    'src/backbone/BbaseEnd.js'
  ];
  if (DEBUG) {
    return gulp.src(source)
      .pipe(concat('bbase_zepto.min.js'))
      .pipe(gulp.dest(dist.bbase));
  }
  return gulp.src(source)
    .pipe(concat('bbase_zepto.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dist.bbase));
});

gulp.task('UserManagement', function () {
  gulp.src(dist.bbase + '/**').pipe(gulp.dest('C:/software/WorkProjects/UserManagement/app/vendor/bbase'));
  gulp.src('./app/ui/bbase/**').pipe(gulp.dest('C:/software/WorkProjects/UserManagement/app/ui/bbase'));
  gulp.src('./app/components/bbase/**').pipe(gulp.dest('C:/software/WorkProjects/UserManagement/app/components/bbase'));
});

gulp.task('Mobile', function () {
  gulp.src(dist.bbase + '/**').pipe(gulp.dest('C:/software/WorkProjects/Mobile/app/vendor/bbase'));
  gulp.src('./app/ui/bbase/**').pipe(gulp.dest('C:/software/WorkProjects/Mobile/app/ui/bbase'));
  gulp.src('./app/components/bbase/**').pipe(gulp.dest('C:/software/WorkProjects/Mobile/app/components/bbase'));
});

gulp.task('Leaflet', function () {
  gulp.src(dist.bbase + '/**').pipe(gulp.dest('C:/software/WebstormProjects/Leaflet/app/vendor/bbase'));
  gulp.src('./app/ui/bbase/**').pipe(gulp.dest('C:/software/WebstormProjects/Leaflet/app/ui/bbase'));
  gulp.src('./app/components/bbase/**').pipe(gulp.dest('C:/software/WebstormProjects/Leaflet/app/components/bbase'));
});

gulp.task('lmc_wcd', function () {
  gulp.src(dist.bbase + '/**').pipe(gulp.dest('C:/software/WorkProjects/lmc_wcd/app/vendor/bbase'));
  gulp.src('./app/ui/bbase/**').pipe(gulp.dest('C:/software/WorkProjects/lmc_wcd/app/ui/bbase'));
  gulp.src('./app/components/bbase/**').pipe(gulp.dest('C:/software/WorkProjects/lmc_wcd/app/components/bbase'));
});
gulp.task('Pc', function () {
  gulp.src(dist.bbase + '/**').pipe(gulp.dest('C:/software/WorkProjects/Pc/app/vendor/bbase'));
  gulp.src('./app/ui/bbase/**').pipe(gulp.dest('C:/software/WorkProjects/Pc/app/ui/bbase'));
  gulp.src('./app/components/bbase/**').pipe(gulp.dest('C:/software/WorkProjects/Pc/app/components/bbase'));
});


gulp.task('readme', function () {
  return gulp.src('README.md')
    .pipe(markdown())
    .pipe(gulp.dest(dist.readme));
});

gulp.task('build', function (callback) {
  DEBUG = true;
  runSequence(['bbase_jquery'], ['bbase_zepto'], ['UserManagement', 'Mobile', 'Leaflet', 'lmc_wcd', 'Pc','readme'], callback);
});

gulp.task('dist', function (callback) {
  DEBUG = false;
  runSequence(['bbase_jquery', 'bbase_zepto'], ['UserManagement', 'Mobile', 'Leaflet', 'lmc_wcd', 'Pc','readme'], callback);
});

// dist
