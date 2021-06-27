import gulp from "gulp";
import gulpWS from "gulp-webserver";
import del from "del";
// Image
import gulpImg from "gulp-image";
// JavsScript
import gulpBro from "gulp-bro";
// HTML
import gulpPug from "gulp-pug";
// CSS
import gulpAutop from "gulp-autoprefixer";
import gulpCsso from "gulp-csso";

const sass = require("gulp-sass")(require("sass"));

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build",
  },
  scss: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/*.scss",
    dest: "build/css",
  },
  ts: {
    src: "src/ts/main.ts",
    dest: "build/js",
  },
  img: {
    src: "src/img/*",
    dest: "build/img",
  },
};

const pug = () =>
  gulp.src(routes.pug.src).pipe(gulpPug()).pipe(gulp.dest(routes.pug.dest));

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass.sync().on("error", sass.logError))
    .pipe(gulpAutop())
    .pipe(gulpCsso())
    .pipe(gulp.dest(routes.scss.dest));

const js = () => gulp.src(routes.ts.src).pipe();

const img = () =>
  gulp.src(routes.img.src).pipe(gulpImg()).pipe(gulp.dest(routes.img.dest));

const clean = () => del(["build"]);

const webserver = () =>
  gulp.src("build").pipe(gulpWS({ livereload: true, open: true }));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.scss.watch, styles);
  // gulp.watch(routes.img.src, img);
};

// Series

const prepare = gulp.series(clean, img);

const assets = gulp.series(pug, styles);

// 병렬 연산으로 앞뒤가 바뀌어도 된다!!!!
const postDev = gulp.parallel(webserver, watch);

export const dev = gulp.series(prepare, assets, postDev);
