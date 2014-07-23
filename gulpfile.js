'use strict';

//=============================================
//            DECLARE CORE VARIABLES
//=============================================

/**
 * Load required core dependencies. These are installed based on the versions listed
 * in 'package.json' when you do 'npm install' in this directory.
 */
var fs          = require('fs');
var pkg         = require('./package.json');
var open        = require("open");
var path        = require('path');
var argv        = require('minimist')(process.argv.slice(2));
var gulp        = require('gulp');
var karma       = require('karma').server;
var semver      = require('semver');
var browser     = require('tiny-lr')();
var express     = require('express');
var wiredep     = require('wiredep').stream;
var changelog   = require('conventional-changelog');
var runSequence = require('run-sequence');


//=============================================
//            DECLARE GULP VARIABLES
//=============================================

/**
 * Load required Gulp tasks. These are installed based on the versions listed
 * in 'package.json' when you do 'npm install' in this directory.
 */
var size                 = require('gulp-size');
var gzip                 = require('gulp-gzip');
var bump                 = require('gulp-bump');
var help                 = require('gulp-help')(gulp);
var exec                 = require('gulp-exec');
var gutil                = require('gulp-util');
var bower                = require('gulp-bower');
var watch                = require('gulp-watch');
var clean                = require('gulp-clean');
var gulpif               = require('gulp-if');
var jshint               = require('gulp-jshint');
var header               = require('gulp-header');
var uglify               = require('gulp-uglify');
var rename               = require('gulp-rename');
var concat               = require('gulp-concat');
var refresh              = require('gulp-livereload');
var sourcemaps           = require('gulp-sourcemaps');
var ngAnnotate           = require('gulp-ng-annotate');
var coverageEnforcer     = require("gulp-istanbul-enforcer");


//=============================================
//            DECLARE CONSTANTS
//=============================================

/**
 * Declare constants that are use in gulpfile.js or angular app
 */
var COLORS               = gutil.colors;
var DEMO_PORT            = 9000;
var LIVERELOAD_PORT      = 35729;

//=============================================
//            DECLARE VARIABLES
//=============================================
/**
 * Declare variables that are use in gulpfile.js
 */
var hasGitChanges   = '';
var isWatching      = false;


//=============================================
//            DECLARE PATHS
//=============================================

var paths = {
    gulpfile:       'gulpfile.js',
    dist:           'dist/',
    src:            'src/*.js',
    vendor:         'bower_components/',
    html:           'demo/*.html',
    tmp:            '.tmp',
    testReports:    '.tmp/test-reports/coverage/'
};


//=============================================
//            DECLARE BANNER DETAILS
//=============================================

/**
 * The banner is the comment that is placed at the top of our compiled
 * source files. It is first processed as a Grunt template, where the `<%=`
 * pairs are evaluated based on this very configuration object.
 */
var banner = gutil.template('/**\n' +
    ' * <%= pkg.description %>\n' +
    ' * @version v<%= pkg.version %> - <%= today %>\n' +
    ' * @link <%= pkg.homepage %>\n' +
    ' * @author <%= pkg.author.name %>\n' +
    ' * @copyright <%= year %>(c) <%= pkg.author.name %>\n' +
    ' * @license <%= pkg.licenses.type %>, <%= pkg.licenses.url %>\n' +
    ' */\n', {file: '', pkg: pkg, today: new Date().toISOString().substr(0, 10), year: new Date().toISOString().substr(0, 4)});


//=============================================
//               SUB TASKS
//=============================================

gulp.task('clean', 'Delete \'dist\' directory', function () {
    return gulp.src([paths.dist, paths.tmp], {read: false})
        .pipe(clean());
});

gulp.task('copy', 'Copy no-minified source files into \'dist\' folder.', function () {
    return gulp.src(paths.src)
        .pipe(concat(pkg.name + '.js'))
        .pipe(header(banner, { pkg : pkg, date: new Date }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('bower', 'Install all bower dependencies specify in bower.json from bower repository', function () {
    return bower();
});

gulp.task('bower-install', 'Does the same as \'bower\' task but also inject bower components to index.html', ['bower'], function () {
    return gulp.src(paths.html)
        .pipe(wiredep({
            directory: paths.vendor
        }))
        .pipe(gulp.dest('./demo'))
        .pipe(size());
});

gulp.task('jshint', 'Hint src JavaScripts files', function () {
    return gulp.src(paths.src)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(gulpif(!isWatching, jshint.reporter('fail')))
        .pipe(gulpif(isWatching, refresh(browser)))
        .pipe(size());
});

gulp.task('compress', 'Compress js files to min.js', function() {
    return gulp.src(paths.src)
        .pipe(sourcemaps.init())
        .pipe(concat(pkg.name + '.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(header(banner))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist))
        .pipe(size())
        .on('error', function (error) {
            gutil.log(COLORS.red('Error: compress failed '  + error));
            return process.exit(1);
        });
});

gulp.task('compress:gzip', 'Compress js files to min.js.gz', function() {
    return gulp.src(paths.src)
        .pipe(concat(pkg.name + '.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(header(banner))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist))
        .pipe(gzip())
        .pipe(gulp.dest(paths.dist))
        .pipe(size())
        .on('error', function (error) {
            gutil.log(COLORS.red('Error: compress:zip failed ' + error));
            return process.exit(1);
        });
});

gulp.task('watch', 'Watch files for changes', function () {

    // set to 'true' to avoid process exit on error for jshint
    isWatching = true;

    // Listen on port 35729
    browser.listen(LIVERELOAD_PORT, function (err) {
        if (err) {
            return console.log(err);
        }

        gulp.watch([
            paths.html
        ], function (event) {
            return gulp.src(event.path)
                .pipe(refresh(browser));
        });

        // Watch js files
        gulp.watch(paths.src, ['jshint']);

        // Watch bower file
        gulp.watch('bower.json', ['bower-install']);
    });

});

gulp.task('karma', 'Run karma unit tests', ['bower-install'], function (cb) {
    // remove 'coverage' directory before each test
    gulp.src(paths.testReports, {read: false})
        .pipe(clean())
        .on('finish', function() {
            // run the karma test
            karma.start({
                configFile: path.join(__dirname, 'karma.conf.js'),
                browsers: ['PhantomJS']
            }, function(code) {
                // make sure failed karma tests cause gulp to exit non-zero
                if(code === 1) {
                    gutil.log(COLORS.red('Error: unit test failed '));
                    process.exit(1);
                }
                cb();
            });
        });
});

gulp.task('check', 'Check if there are any changes to commit', function (cb) {
    require('child_process').exec('git status --porcelain', function (err, stdout) {
        hasGitChanges = stdout;
        cb(err);
    });
});

//=============================================
//                MAIN TASKS
//=============================================

/**
 * The demo web server.
 */
gulp.task('serve', 'Run the demo web server', ['bower-install', 'watch'], function() {
    var app = express();
    app.use(express.static('./'));
    app.use(express.static('demo'));
    app.listen(DEMO_PORT);
    app.post('/error', function(req, res) {
        console.log("Got UI error:\n", JSON.stringify(req.body, null, 2));
        console.log("\n\n");

        res.json(200);
    });
    if(gutil.env.open) {
        gutil.log('Opening dev server URL in browser');
        open('http://localhost:' + DEMO_PORT);
    } else {
        gutil.log(COLORS.yellow('Hint: Run with --open to automatically open URL on startup'));
    }
});

/**
 * Run unit test and coverage.
 */
gulp.task('test', 'Run unit tests and coverage', ['karma'], function () {
    var options = {
        thresholds : {
            statements : 95,
            branches : 90,
            lines : 95,
            functions : 95
        },
        coverageDirectory: paths.testReports,
        rootDirectory : paths.tmp // keep root `.tmp` so enforce plugin is not searching in other directories
    };
    return gulp.src('.')
//        .pipe(coverageEnforcer(options))
        .on('error', function(error) {
            gutil.log(error.toString());
            process.exit(1);
        });
});

/**
 * The 'build' task gets app ready for deployment by
 * minifying etc.
 */
gulp.task('build', 'Build dist files', function (cb) {
    runSequence(
        ['clean', 'jshint', 'bower-install'],
        'test',
        ['compress', 'compress:gzip', 'copy'],
        cb);
});

/**
 * Bump version number in package.json & bower.json.
 */
gulp.task('bump', 'Bump version number in package.json & bower.json', ['jshint'], function () {
    var HAS_REQUIRED_ATTRIBUTE = !!argv.type ? !!argv.type.match(new RegExp(/major|minor|patch/)) : false;

    if (!HAS_REQUIRED_ATTRIBUTE) {
        gutil.log(COLORS.red('Error: Required bump \'type\' is missing! Usage: gulp bump --type=(major|minor|patch)'));
        return process.exit(1);
    }

    if (!semver.valid(pkg.version)) {
        gutil.log(COLORS.red('Error: Invalid version number - ' + pkg.version));
        return process.exit(1);
    }

    return gulp.src(['package.json', 'bower.json'])
        .pipe(bump({type: argv.type}))
        .pipe(gulp.dest('./'));
});

/**
 * Generate changelog.
 */
gulp.task('changelog', 'Generate changelog', function(callback) {
    changelog({
        version: pkg.version,
        repository: 'https://github.com/martinmicunda/mm-angular-logger'
    }, function(err, log) {
        if (err) {
            gutil.log(COLORS.red('Error: Failed to generate changelog ' + err));
            return process.exit(1);
        }
        fs.writeFileSync('CHANGELOG.md', log);
    });
    callback();
});

/**
 * The 'release' task push package.json and CHANGELOG.md to GitHub.
 */
gulp.task('release', 'Release bumped version number to GitHub repo', ['check'], function () {
    if (!semver.valid(pkg.version)) {
        gutil.log(COLORS.red('Error: Invalid version number - ' + pkg.version + '. Please fix the the version number in package.json and run \'gulp publish\' command again.'));
        return process.exit(1);
    }

    if (hasGitChanges === '') {
        gutil.log(COLORS.red('Error: No changes detected in this repo. Aborting release.'));
        return process.exit(1);
    }

    gutil.log(COLORS.blue('Pushing to GitHub ...'));
    var commitMsg = 'chore(release): v' + pkg.version;
    return gulp.src('package.json')
        .pipe(exec('git add dist CHANGELOG.md package.json bower.json'))
        .pipe(exec('git commit -m "' + commitMsg + '" --no-verify'))
        .pipe(exec('git push origin master'));
});
