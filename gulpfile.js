const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const LessPluginAutoPrefix = require("less-plugin-autoprefix")

var autoprefix = new LessPluginAutoPrefix({
    browsers: [
        "ie >= 8",
        "ie_mob >= 10",
        "ff >= 26",
        "chrome >= 30",
        "safari >= 6",
        "opera >= 23",
        "ios >= 5",
        "android >= 2.3",
        "bb >= 10"
    ],
    cascade: true, //是否美化属性值 默认：true
    remove: true //是否去掉不必要的前缀 默认：true 
});
gulp.task('less', function() {
    gulp.src('./src/styles/**/*.less')
        .pipe(plugins.less({
            plugins: [autoprefix]
        }))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest('./public/styles'));
});
gulp.task('js', function() {
    gulp.src('./src/scripts/**/*.js')
        .pipe(plugins.jshint())
        .pipe(plugins.uglify({
            mangle: true, //类型：Boolean 默认：true 是否修改变量名
            compress: true, //类型：Boolean 默认：true 是否完全压缩
            preserveComments: false
        }))
        .pipe(gulp.dest('./public/scripts'));
});
gulp.task('html', function() {
    gulp.src('./src/**/*.html')
        .pipe(plugins.minifyHtml())
        .pipe(gulp.dest('./public'));
});
gulp.task('clean', function() {
    gulp.src('./public')
        .pipe(plugins.clean());
});
gulp.task('copy', function() {
    gulp.src('./src/plugins/**/*').pipe(gulp.dest('./public/plugins'));
    gulp.src('./src/resources/**/*').pipe(gulp.dest('./public/resources'));
    gulp.src('./src/images/**/*').pipe(gulp.dest('./public/images'));
    gulp.src('./src/favicon.ico').pipe(gulp.dest('./public'));
});
gulp.task('watch', function() {
    gulp.watch('./src/**/*', ['less', 'js']);
});

gulp.task('default', ['less', 'js', 'html', 'watch']);
gulp.task('build', ['less', 'js', 'html', 'copy']);
