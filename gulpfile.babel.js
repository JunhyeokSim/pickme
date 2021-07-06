import gulp from "gulp";
import gulpWS from "gulp-webserver";
import gulpGhPages from "gulp-gh-pages";
import del from "del";

// Image
import gulpImg from "gulp-image";

// JavsScript
import tsify from "tsify";
import browserify from "browserify";
import vinylSource from "vinyl-source-stream";
import vinylBuffer from "vinyl-buffer";
import gulpUglify from "gulp-uglify";
import gulpSourcemaps from "gulp-sourcemaps";

// HTML
import gulpPug from "gulp-pug";

// CSS
import gulpAutop from "gulp-autoprefixer";
import gulpCsso from "gulp-csso";

const sass = require("gulp-sass")(require("sass"));

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/views/*.pug",
    dest: "build",
  },
  scss: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/*.scss",
    dest: "build/css",
  },
  ts: {
    watch: "src/ts/**/*.ts",
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

const ts = () =>
  browserify({
    debug: true,
    entries: routes.ts.src,
  })
    .plugin(tsify)
    .transform("babelify", {
      presets: ["@babel/preset-env"],
      extensions: [".tsx", ".ts"],
    })
    .bundle()
    .pipe(vinylSource("main.js"))
    .pipe(vinylBuffer())
    .pipe(gulpSourcemaps.init({ loadMaps: true }))
    .pipe(gulpUglify())
    .pipe(gulpSourcemaps.write("./"))
    .pipe(gulp.dest(routes.ts.dest));

const img = () =>
  gulp.src(routes.img.src).pipe(gulpImg()).pipe(gulp.dest(routes.img.dest));

const clean = () => del(["build", ".publish"]);

const webserver = () =>
  gulp.src("build").pipe(gulpWS({ livereload: true, open: true }));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.ts.watch, ts);

  // gulp.watch(routes.img.src, img);
};

// Deploy
const ghDeploy = () => gulp.src("build/**/*").pipe(gulpGhPages());

// Series
const prepare = gulp.series(clean, img);

const assets = gulp.series(pug, styles, ts);

// 병렬 연산으로 앞뒤가 바뀌어도 된다!!!!
const live = gulp.parallel(webserver, watch);

export const build = gulp.series(prepare, assets);
export const dev = gulp.series(build, live);
export const deploy = gulp.series(build, ghDeploy);
