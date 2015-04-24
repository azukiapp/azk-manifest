require('source-map-support').install();

var chalk = require('chalk');
var package_json = require('./package.json');
var stack_trace_name = [
  '/',
  chalk.styles.gray.close,
  chalk.bold.yellow(package_json.name),
  chalk.gray('('),
  chalk.yellow(package_json.version),
  chalk.gray(')'),
  chalk.styles.gray.open,
].join('');

var azk_gulp = require('azk-dev/gulp')({
  cwd  : __dirname,
  sourcemaps_path: stack_trace_name, // Custom path to prefix transpiled files
  lint: [ "bin/**/*.js" ], // Extra files for the lint analyzer
  default: ['watch:test:lint'],
});

var gulp = azk_gulp.gulp;

gulp.task("show:args", "Help text", ["before:show"], function() {
  console.log(azk_gulp.yargs.argv);
  return null;
}, { aliases: ["sa", "s"] });
