// Plugins
var gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    sourcemaps = require("gulp-sourcemaps"),
    browserSync = require("browser-sync").create(),
    fileInclude = require('gulp-file-include');

// File paths
var paths = {
    styles: "app/scss/*.scss",
};


// Tasks
function style() {
    return gulp
        .src(paths.styles)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream()); // Injects new styles
}

function partialFiles() {
    return gulp
        .src('app/pages/*.html')
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist'))
}

function moveImg() {
    return gulp
        .src('app/img/**.*')
        .pipe(gulp.dest('dist/img'))
}


function reload() {
    browserSync.reload();
}

function watch() {
    browserSync.init({
        // You can tell browserSync to use this directory and serve it as a mini-server
        
        server: {
            baseDir: "./dist"
        }
    });
    gulp.watch(paths.styles, style);
    gulp.watch("app/pages/partials/*.html", partialFiles).on('change', browserSync.reload);
    gulp.watch("app/pages/*.html", partialFiles).on('change', browserSync.reload);
    gulp.watch("app/img/**.*", moveImg).on('change', browserSync.reload);
}
 

exports.watch = watch
exports.style = style;
exports.part = partialFiles;
exports.moveImg = moveImg;

var build = gulp.parallel(style, watch);
 
gulp.task('default', build);