var gulp = require("gulp");
var webserver = require("gulp-webserver");
var mainBowerFiles = require("main-bower-files");
var inject = require("gulp-inject");
var del = require("del");

var paths = {
    dist: "dist",
    distVendor: "dist/vendor",
    distIndex: "dist/index.html",

    index: "app/index.html",
    appSrc: ["app/**/*", "!app/index.html"],
    bowerSrc: "bower_components/**/*"
};

gulp.task("default", ["watch"]);

gulp.task("watch", ["serve"], function () {
    gulp.watch(paths.appSrc, ["scripts"]);
    gulp.watch(paths.bowerSrc, ["vendors"]);
    gulp.watch(paths.index, ["copyAll"]);
});

gulp.task("serve", ["copyAll"], function () {
    return gulp.src(paths.dist)
        .pipe(webserver({
            livereload: true,
            proxies: [{
                source: "/api",
                target: "http://localhost:1337"
            }]
        }));
});

gulp.task("copyAll", function () {
    var tempVendors = gulp.src(mainBowerFiles()).pipe(gulp.dest(paths.distVendor));

    var appFiles = gulp.src(paths.appSrc).pipe(gulp.dest(paths.dist));

    return gulp.src(paths.index)
        .pipe(gulp.dest(paths.dist))
        .pipe(inject(tempVendors, {
            relative: true,
            name: "vendorInject"
        }))
        .pipe(inject(appFiles, {
            relative: true
        }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task("vendors", function () {
    var tempVendors = gulp.src(mainBowerFiles()).pipe(gulp.dest(paths.distVendor));

    return gulp.src(paths.distIndex)
        .pipe(inject(tempVendors, {
            relative: true,
            name: "vendorInject"
        })).pipe(gulp.dest(paths.dist));
});

gulp.task("scripts", function () {
    var appFiles = gulp.src(paths.appSrc).pipe(gulp.dest(paths.dist));

    return gulp.src(paths.distIndex)
        .pipe(inject(appFiles, {
            relative: true
        }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task("clean", function () {
    del([paths.dist]);
});