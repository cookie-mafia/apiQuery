const gulp = require('gulp');
const jscs = require('gulp-jscs');

gulp.task('lint', () => {
  return gulp.src(['src/**/*'])
    .pipe(jscs({'fix' : true}))
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'))
    .pipe(gulp.dest('src'));
} );

gulp.task('pre-commit', ['lint']);