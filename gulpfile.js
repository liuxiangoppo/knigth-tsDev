const gulp = require("gulp");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const nodemon = require("gulp-nodemon");
const zip = require("gulp-zip");

const tsProject = ts.createProject("tsconfig.json");
const packageConfig = require("./package.json");

/**
 * Typescript编译
 */
gulp.task("ts", function () {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist"));
});

/**
 * 监听代码改动并实时编译ts
 */
gulp.task("watch", ["ts"], function () {
    return nodemon({
        script: packageConfig.main,  // 服务的启动脚本文件,默认从package.json中获取,亦可自行设置
        watch: "src",    // 源代码目录
        tasks: ["ts"], // 在重启服务前需要执行的任务
        ext: "ts", // 监听.ts结尾的文件 必须
        // 设置环境
        env: {
            "NODE_ENV": "dev"
        },
        // 必须开启debug模式
        exec: "node --debug"
    });
});

/**
 * 打成zip包
 */
gulp.task("zip", ["ts"], function () {
    return gulp.src(["**/dist/**/*.*", "package.json", "project.json", '!**/node_modules/**/*.*'])
        .pipe(zip(`${packageConfig.name}_${packageConfig.version}.zip`))
        .pipe(gulp.dest(`${packageConfig.zipTarget}`));
});