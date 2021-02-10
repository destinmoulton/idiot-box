var gulp = require("gulp");
var sass = require("gulp-sass");
gulp.task("compile:sass", function () {
    return gulp
        .src("src/scss/idiotbox.scss")
        .pipe(sass({ outputStyle: "compressed" }))
        .pipe(gulp.dest("dist/server/public/css"));
});

gulp.task("watch", function () {
    gulp.watch(
        "src/scss/**/*.scss",
        { ignoreInitial: false },
        gulp.series(["compile:sass"])
    );
});
