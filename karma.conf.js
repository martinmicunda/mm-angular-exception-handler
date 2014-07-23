'use strict';

module.exports = function(config) {

    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',

        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            // libraries
            'bower_components/angular/angular.js',

            // test libraries
            'bower_components/angular-mocks/angular-mocks.js',

            // our app
            'src/**/*.js',

            // tests
            'test/**/*.spec.js'
        ],

        // list of files to exclude
        exclude: [
        ],

        // use dots reporter, as travis terminal does not support escaping sequences
        // possible values: 'dots', 'progress', 'junit'
        // CLI --reporters progress
        reporters: process.env.TRAVIS ? ['dots', 'junit', 'coverage', 'coveralls'] : ['dots', 'junit', 'coverage'],

        junitReporter: {
            // will be resolved to basePath (in the same way as files/exclude patterns)
            outputFile: '.tmp/test-reports/unit-test-report.xml',
            suite: 'unit'
        },

        preprocessors: {
            // source files, that you wanna generate coverage for - do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'src/**/*.js': ['coverage']
        },

        // optionally, configure the reporter
        coverageReporter: {
            reporters: [
                {type: 'html', dir: '.tmp/test-reports/coverage/'}, // will generate html report
                {type: 'json', dir: '.tmp/test-reports/coverage/'}, // will generate json report file and this report is loaded to make sure failed coverage cause gulp to exit non-zero
                {type: 'lcov', dir: '.tmp/test-reports/coverage/'}, // will generate Icov report file and this report is published to coveralls
                {type: 'text-summary', dir: '.tmp/test-reports/coverage/'} // it does not generate any file but it will print coverage to console
            ]
        },

        // web server port
        // CLI --port 9876
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        // CLI --colors --no-colors
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        // CLI --log-level debug
        logLevel: 'INFO',

        // enable / disable watching file and executing tests whenever any file changes
        // CLI --auto-watch --no-auto-watch
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        // CLI --browsers Chrome,Firefox,Safari
        browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],

        // If browser does not capture in given timeout [ms], kill it
        // CLI --capture-timeout 5000
        captureTimeout: 20000,

        // Auto run tests on start (when browsers are captured) and exit
        // CLI --single-run --no-single-run
        singleRun: true,

        // report which specs are slower than 500ms
        // CLI --report-slower-than 500
        reportSlowerThan: 500,

        plugins: [
            'karma-jasmine',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-junit-reporter',
            'karma-coverage',
            'karma-coveralls'
        ]
    });
};
