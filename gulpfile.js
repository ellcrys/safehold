const {
	watch,
	src,
	dest,
	series,
} = require('gulp');
var ts = require('gulp-typescript');

// copySource copies files and directories
// in `/dev` to `/src`
function copySource(cb) {
	src(['./dev/**/*', '!**/*.ts'])
		.pipe(dest('../src', {
			overwrite: true,
			cwd: './dev',
		}));
	cb();
}

// tsCompile compiles typescript files to JS
// and move them to `/src`.
function tsCompile(cb) {
	var project = ts.createProject('tsconfig.json');
	project.src().pipe(project()).js.pipe(dest('src'));
	cb();
}

// compile is the public gulp task
// for running compilation operations
// in series
exports.compile = () => {
	watch('dev/**/*', {
		ignoreInitial: false,
	}, series(copySource, tsCompile));
};
