import pkg from './package.json';
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import uglify from 'gulp-uglify';
import header from 'gulp-header';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import browserify from 'browserify';
import babelify from 'babelify';
import del from 'del';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

const banner = '/*! ${pkg.name} v${pkg.version} | ${pkg.homepage} */\n';

const config = {
    files: './src/**/*.js',
    entryFile: './src/fx.js',
    outputFile: 'fx.js',
    outputDir: './dist/'
};

gulp.task('clean', () => {
    return del.sync([config.outputDir]);
});

gulp.task('build', ['clean'], () => {
    return browserify(config.entryFile, {debug: true, standalone: pkg.name})
        .transform(babelify)
        .bundle()
        .pipe(source(config.outputFile))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(header(banner, {pkg}))
        .pipe(gulp.dest(config.outputDir))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(header(banner, {pkg}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.outputDir));
});

gulp.task('lint', () => {
    return gulp.src(['./gulpfile.babel.js', config.files])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('watch', () => {
    gulp.watch(['./gulpfile.babel.js', config.files], ['lint', 'test']);
});

gulp.task('default', [
    'lint',
    'build',
    'watch'
]);
