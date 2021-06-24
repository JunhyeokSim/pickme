import gulp from "gulp";
import gulpPug from "gulp-pug";
import del from "del";
import gulpWS from "gulp-webserver";
import gulpImg from "gulp-image";

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build",
  },
  img: {
    src: "src/img/*",
    dest: "build/img",
  },
};

const pug = () =>
  gulp.src(routes.pug.src).pipe(gulpPug()).pipe(gulp.dest(routes.pug.dest));

const img = () =>
  gulp.src(routes.img.src).pipe(gulpImg()).pipe(gulp.dest(routes.img.dest));

const clean = () => del(["build"]);

const webserver = () =>
  gulp.src("build").pipe(gulpWS({ livereload: true, open: true }));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
};

// Series

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug]);

// 병렬 연산으로 앞뒤가 바뀌어도 된다!!!!
const postDev = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, postDev]);
