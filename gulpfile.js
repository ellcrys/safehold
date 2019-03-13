const {
	watch,
	src,
	dest,
	series,
	parallel,
} = require('gulp');
var ts = require('gulp-typescript');

// copyAllNonTSFiles copies non-typescript
// files and directories from `/dev` to `/src`
function copyAllNonTSFiles(cb) {
	src(['./dev/**/*', '!**/*.ts'])
		.pipe(dest('../src', {
			overwrite: true,
			cwd: './dev',
		}));
	cb();
}

// copyFrontendFiles copies non-typescript and
// javascript files and directories from `/dev` to `/src`
function copyFrontendFiles(cb) {
	src(['./dev/**/*', '!**/*.{ts,js}'])
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
	watch(['dev/core/**/*', 'dev/utilities/**/*'], {
		ignoreInitial: false,
	}, series(tsCompile));
};

// watchAndCopyFrontend watches and copies
// non-backend files
exports.watchAndCopyFrontend = () => {
	watch('dev/renderer/**/*', {
		ignoreInitial: false,
	}, series(copyFrontendFiles));
};

exports.work = series(copyAllNonTSFiles, parallel(exports.compile, exports.watchAndCopyFrontend));
