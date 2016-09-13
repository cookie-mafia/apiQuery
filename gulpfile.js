const gulp     = require('gulp');
const jscs     = require('gulp-jscs');
const mocha    = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const codacy   = require('gulp-codacy');

const lint = () => {
  return gulp.src(['src/**/*'])
    .pipe(jscs({'fix': true}))
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'))
    .pipe(gulp.dest('src'));
};

const test = () => {
  gulp.src([
        'src/*.test.js',
        'src/**/*.test.js'
    ]).pipe(mocha())
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({'thresholds': {'global': 100}}))
    .once('error', () => {
      process.exit(1);
    })
    .once('end', () => {
      process.exit();
    });
};

const preTest = () => {
  return gulp.src([
        '!src/*.test.js',
        '!src/**/*.test.js',
        'src/*.js',
        'src/**/*.js'
    ]).pipe(istanbul())
    .pipe(istanbul.hookRequire());
};

const codacyTask = () => {
  return gulp
    .src(['./coverage/lcov.info'], {'read': false})
    .pipe(codacy({'token': ''}))
  ;
};

gulp.task('codacy', codacyTask);
gulp.task('pre-test', preTest);
gulp.task('lint', lint);
gulp.task('test', ['pre-test'], test);
gulp.task('pre-commit', ['lint', 'test', 'pre-test']);
