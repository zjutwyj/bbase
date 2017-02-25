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



//** ==================================================== 项目发布 ====================================================*/
var paths = {};
var SRCDIR = './app',
  TMPDIR = './.tmp',
  dist = {
    bbase: './vendor/bbase',
    UserMangement: ''
  },
  DEBUG = true;

function doTask(item, debug) {
  for (var key in paths[item]) {
    switch (key) {
      case 'scripts':
        try {
          gulp.task(item + key, function () {
            if (debug) {
              return gulp.src(paths[item].scripts.source)
                /*.pipe(jshint())
                 .pipe(jshint.reporter(stylish))*/
                .pipe(concat(paths[item].scripts.name))
                .pipe(gulp.dest(paths[item].scripts.dist));
            }
            return gulp.src(paths[item].scripts.source)
              .pipe(concat(paths[item].scripts.name))
              .pipe(uglify())
              .pipe(gulp.dest(paths[item].scripts.dist));
          });
          gulp.start(item + key);
        } catch (e) {
          console.error(item + key + e);
        }
        break;

      case 'styles':
        try {
          gulp.task(item + key, function () {
            return gulp.src(paths[item].styles.source)
              .pipe(minifyCSS({ keepBreaks: true }))
              .pipe(gulp.dest(paths[item].styles.dist));
          });
          gulp.start(item + key);
        } catch (e) {
          console.error(item + key + e);
        }
        break;

      case 'doc':
        try {
          gulp.task(item + key, function () {
            return gulp.src(paths[item].doc.source)
              .pipe(yuidoc())
              .pipe(gulp.dest(paths[item].doc.dist))
          });
          gulp.start(item + key);
        } catch (e) {
          console.error(item + key + e);
        }
        break;

      case 'images':
        try {
          gulp.task(item + key, function () {
            return gulp.src(paths[item].images.source)
              .pipe(imagemin({ optimizationLevel: 5 }))
              .pipe(gulp.dest(paths[item].images.dist));
          });
          gulp.start(item + key);
        } catch (e) {
          console.error(item + key + e);
        }
        break;
      default:
    }
  }
}

/**
 * 处理脚本
 * @param  {object} options 配置
 * @param  {boolean} debug  是否调试
 * @return {[type]}         [description]
 */
function handleScripts(options, debug) {
  try {
    var config = options.scripts;
    var name = config.name;

    gulp.task(name, function () {
      if (debug) {
        return gulp.src(config.source)
          .pipe(concat(config.name))
          .pipe(gulp.dest(config.dist));
      }
      return gulp.src(config.source)
        .pipe(concat(config.name))
        .pipe(uglify())
        .pipe(gulp.dest(config.dist));
    });
    gulp.start(name);
  } catch (e) {
    console.error(e);
  }
}
/**
 * 处理样式
 * @param  {[type]} options [description]
 * @param  {[type]} debug   [description]
 * @return {[type]}         [description]
 */
function handleStyles(options, debug) {
  try {
    var config = options.styles;
    var name = config.name;
    gulp.task(name, function () {
      return gulp.src(config.source)
        .pipe(minifyCSS({
          keepBreaks: true
        }))
        .pipe(gulp.dest(config.dist));
    });
    gulp.start(name);
  } catch (e) {
    console.error(e);
  }
}
/**
 * 处理文档
 * @param  {[type]} options [description]
 * @param  {[type]} debug   [description]
 * @return {[type]}         [description]
 */
function handleDoc(options, debug) {
  try {
    var config = options.doc;
    var name = config.name;
    gulp.task(name, function () {
      return gulp.src(config.source)
        .pipe(yuidoc())
        .pipe(gulp.dest(config.dist));
    });
    gulp.start(name);
  } catch (e) {
    console.error(e);
  }
}
/**
 * 处理图片
 * @param  {[type]} options [description]
 * @param  {[type]} debug   [description]
 * @return {[type]}         [description]
 */
function handleImages(options, debug) {
  try {
    var config = options.images;
    var name = config.name;
    gulp.task(name, function () {
      return gulp.src(config.source)
        .pipe(imagemin({
          optimizationLevel: 5
        }))
        .pipe(gulp.dest(config.dist));
    });
    gulp.start(name);
  } catch (e) {
    console.error(e);
  }
}

/**
 * 基础任务
 * @param  {[type]} options  [description]
 * @param  {[type]} debug [description]
 * @return {[type]}       [description]
 */
function baseTask(options, debug) {
  for (var key in options) {
    switch (key) {
      case 'scripts':
        handleScripts(options, debug);
        break;
      case 'styles':
        handleStyles(options, debug);
        break;
      case 'doc':
        handleDoc(options, debug);
        break;
      case 'images':
        handleImages(options, debug);
        break;
      default:
    }
  }
}

// 手机端bbass
gulp.task('bbase_jquery', function () {
  baseTask({
    scripts: {
      source: [
        'backbone/BbaseJqueryPre.js',
        'Est/Est.source.js',
        'vendor/backbone/backbone-debug-est.js',
        'vendor/handlebars/handlebars-debug.js',

        'handlebars/HandlebarsHelper.js',
        'backbone/BbaseApp.js',
        'backbone/BbaseUtils.js',
        'backbone/BbaseService.js',
        'backbone/BbaseSuperView.js',
        'backbone/BbaseView.js',
        'backbone/BbaseList.js',
        'backbone/BbaseItem.js',
        'backbone/BbaseCollection.js',
        'backbone/BbaseModel.js',
        'backbone/BbaseDetail.js',
        'backbone/BbaseBootstrap.js',
        'backbone/BbaseDirective.js',
        'backbone/BbaseStatus.js',
        'backbone/BbaseEnd.js',

      ],
      name: 'bbase_jquery.min.js',
      dist: dist.bbase
    }
  }, DEBUG);
});
// 手机端精简bbass
gulp.task('bbase_zepto', function () {
  baseTask({
    scripts: {
      source: [
        'vendor/zepto/deferred.js',
        'vendor/zepto/callbacks.js',
        'vendor/zepto/selector.js',
        'vendor/zepto/hover.js',
        'backbone/BbaseZeptoPre.js',
        'Est/Est.source.js',
        'vendor/backbone/backbone-debug-est.js',
        'vendor/handlebars/handlebars-debug.js',

        'handlebars/HandlebarsHelper.js',
        'backbone/BbaseApp.js',
        'backbone/BbaseUtils.js',
        'backbone/BbaseService.js',
        'backbone/BbaseSuperView.js',
        'backbone/BbaseView.js',
        'backbone/BbaseList.js',
        'backbone/BbaseItem.js',
        'backbone/BbaseCollection.js',
        'backbone/BbaseModel.js',
        'backbone/BbaseDetail.js',
        'backbone/BbaseBootstrap.js',
        'backbone/BbaseDirective.js',
        'backbone/BbaseStatus.js',
        'backbone/BbaseEnd.js'
      ],
      name: 'bbase_zepto.min.js',
      dist: dist.bbase
    }
  }, DEBUG);
});

gulp.task('publish', function(){
  gulp.src(dist.bbase + '/**').pipe(gulp.dest('C:/software/WorkProjects/UserManagement/app/vendor/bbase'));
  gulp.src(dist.bbase + '/**').pipe(gulp.dest('C:/software/WorkProjects/Mobile/app/vendor/bbase'));
  gulp.src(dist.bbase + '/**').pipe(gulp.dest('C:/software/WebstormProjects/Leaflet/app/vendor/bbase'));
  gulp.src(dist.bbase + '/**').pipe(gulp.dest('C:/software/WorkProjects/lmc_wcd/app/vendor/bbase'));
});

gulp.task('dist', function (callback) {
  runSequence(['bbase_jquery'], ['bbase_zepto'], ['publish'], callback);
});

// dist
