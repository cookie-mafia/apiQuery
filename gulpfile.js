const gulp  = require('gulp');
const jscs  = require('gulp-jscs');
const mocha = require('gulp-mocha');

const lint = () => {
	return gulp.src(['src/**/*'])
		.pipe(jscs({'fix' : true}))
		.pipe(jscs.reporter())
		.pipe(jscs.reporter('fail'))
		.pipe(gulp.dest('src'));
};

const test = () => {
	gulp.src(['src/*.test.js', 'src/**/*.test.js'])
        .pipe(mocha())
        .once('error', () => {
			process.exit(1);
        })
        .once('end', () => {
            process.exit();
        });
};

gulp.task('lint', lint);
gulp.task('test', test);
gulp.task('pre-commit', ['lint', 'test']);