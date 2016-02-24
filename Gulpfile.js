var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var juice = require('juice');
var sass = require('node-sass');
var nunjucksLib = require('nunjucks');
var through = require('through2');
var File = require('vinyl');

var nunjucks = new nunjucksLib.Environment(new nunjucksLib.FileSystemLoader('templates'));


gulp.task('scss', function (callback) {
  gulp.src('./scss/main.scss')
  .pipe(sass({
    outputStyle: 'expanded'
  }))
  .pipe(gulp.dest('./css'));
});

var buildTemplate = function (options, callback) {
  gutil.log('Compiling SCSS...');
  sass.render({
    file: './scss/main.scss'
  }, function (err, result) {
    if(err) {
      return callback(err);
    }

    var css = result.css.toString();

    var template = path.resolve(process.cwd(), options.template );
    gutil.log('Rendering Template %s...', template);
    var renderedTemplate = nunjucks.render(template, {
      css: css,
      content: {
        subject: 'Hello there!'
      }
    });

    gutil.log('Inlining CSS...');
    var inlined = juice(renderedTemplate, {
      preserveMediaQueries: true,
      removeStyleTags: false
    });

    // ensure we've got a valid build directory
    var buildPath = path.resolve(process.cwd(), './build');
    try {
      fs.statSync(buildPath)
    }
    catch (e) {
      gutil.log('Build directory not found, creating...');
      if (e.code === 'ENOENT') {
        fs.mkdirSync(buildPath)
      }
      else {
        // something else is going on here
        gutil.log('Unknown error checking build directory...');
        process.exit(1);
      }
    }

    if(options.output) {
      fs.writeFileSync(path.resolve(buildPath, options.output), inlined);
    }
    else {
      fs.writeFileSync(path.resolve(buildPath, path.basename(options.template)), inlined);
    }

    return callback();
  });
};

gulp.task('build', function (next) {
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

gulp.task('manualbuild', function (next) {
  var spawn = require('child_process').spawn;

  var proc = spawn('gulp', ['build', '-t', 'templates/new-user-no-activity.html'], {stdio: 'inherit'});

  proc.on('close', function () {
    next();
  });
});

gulp.task('mail', function (next) {
  var mailgun = require('mailgun-js')({
    apiKey: process.env.MG_APIKEY,
    domain: process.env.MG_DOMAIN
  });

  var argv = require('yargs')
    .alias('f', 'file')
    .alias('t', 'to')
    .demand(['f'])
    .argv;

  mailgun.messages().send({
    from: 'Carina Email Test <noreply@getcarina.com>',
    to: argv.to,
    subject: 'Carina Email Test',
    html: fs.readFileSync(path.join(process.cwd(), argv.file)).toString('utf-8')
  }, function (err, body) {
    if(err) {
      return next(err);
    }

    return next();
  });
});

gulp.task('watch', function () {
  gulp.watch(['scss/**/*.scss', 'templates/**/*.html'], ['manualbuild']);
});
