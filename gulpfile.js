const gulp = require("gulp");
const path = require('path');
const del = require("del");
const rev = require("gulp-rev");
const revReplace = require('gulp-rev-replace');
const autoprefixer = require("gulp-autoprefixer");
const sass = require("gulp-sass");
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const buildPath = './dist';
const tempPath = './temp';

// 清理 build, _rjs 文件夹
gulp.task("clear", function() {
    return del([buildPath, tempPath]);
});

const revStaticsManifest = 'rev-statics.json';

gulp.task('revStatics', ['clear'], function() {
    return gulp.src('./src/img/*', {base: "./src"})
        .pipe(rev())
        .pipe(gulp.dest(buildPath))
        .pipe(rev.manifest(revStaticsManifest))
        .pipe(gulp.dest(tempPath));
});

gulp.task('revStaticsReplace', ['revStatics'], () => {
    const manifest = gulp.src(path.join(tempPath, revStaticsManifest));

    return gulp.src('./src/**/*.{html,js,scss}', { base: './src' })
        .pipe(revReplace({manifest}))
        .pipe(gulp.dest(tempPath))
});

gulp.task('sass:build', ['revStaticsReplace'], () => {
    return gulp.src('./temp/scss/*.scss')
        .pipe(sass.sync({outputStyle: "compressed"}).on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'android 4', 'ios 8'],
            cascade: true,
            remove: true
        }))
        .pipe(gulp.dest('./temp/css'));
});

gulp.task('babel:build', ['revStaticsReplace'], () => {
    gulp.src('./temp/js/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./temp/js'))
});

const revCodeManifest = 'rev-code-manifest.json';

gulp.task('revCode', ['sass:build', 'babel:build'], () => {
    return gulp.src(['./temp/js/*', './temp/css/*'], {base: './temp'})
        .pipe(rev())
        .pipe(gulp.dest(buildPath))
        .pipe(rev.manifest(revCodeManifest))
        .pipe(gulp.dest(tempPath))
});

gulp.task('revCodeReplace', ['revCode'], () => {
    const manifest = gulp.src(path.join(tempPath, revCodeManifest))

    return gulp.src('./temp/**/*.html', {base: './temp'})
        .pipe(revReplace({manifest}))
        .pipe(gulp.dest(buildPath));
});

gulp.task("default", ["revCodeReplace"], function() {

});

const scssPath = './src/scss/*.scss';
const scssOutputPath = './src/css';

gulp.task("sass", function() {
    return gulp.src(scssPath)
        .pipe(sass.sync({outputStyle: "expanded"}).on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'android 4', 'ios 8'],
            cascade: true,
            remove: true
        }))
        .pipe(gulp.dest(scssOutputPath));
});


gulp.task("watch", ["sass"], function() {
    gulp.watch(scssPath, ["sass"]);
});