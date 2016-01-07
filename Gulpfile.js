var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var source = require('vinyl-source-stream');
var juice = require('juice');
var sass = require('node-sass');
var swig = require('swig');
var through = require('through2');
var File = require('vinyl');


gulp.task('scss', function (callback) {
  gulp.src('./scss/main.scss')
  .pipe(sass({
    outputStyle: 'expanded'
  }))
  .pipe(gulp.dest('./css'));
});

var buildTemplate = function (options, callback) {
  sass.render({
    file: './scss/main.scss'
  }, function (err, result) {
    if(err) {
      return callback(err);
    }

    var css = result.css.toString();

    var template = path.resolve(process.cwd(), './templates/' + options.template );

    var renderedTemplate = swig.renderFile(template, {
      css: css,
      content: {
        subject: 'Hello there!'
      }
    });

    var inlined = juice(renderedTemplate, {
      preserveMediaQueries: true
    });

    if(options.output) {
      fs.writeFileSync(path.resolve(process.cwd(), './build/' + options.output), inlined);
    }
    else {
      process.stdout.write(inlined);
    }



    return callback();
  });
};

gulp.task('swig', function (next) {
  var argv = require('yargs')
    .alias('t', 'template')
    .alias('d', 'data')
    .alias('o', 'output')
    .demand(['t'])
    .argv;

  buildTemplate({
    template: argv.template,
    data: argv.data,
    output: argv.output
  }, next);
});
