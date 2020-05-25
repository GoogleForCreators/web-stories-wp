/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const webpackConfig = require('./webpack.config.test.cjs');

module.exports = function (config) {
  config.set({
    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-coverage',
      require('./karma/karma-puppeteer-launcher'),
      require('./karma/karma-puppeteer-client'),
    ],

    // Frameworks to use.
    // Available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'karma-puppeteer-client'],

    // Base path that will be used to resolve all patterns (eg. files, exclude).
    basePath: 'assets/src/edit-story',

    // list of files / patterns to load in the browser
    files: [{ pattern: '**/karma/**/*.js', watched: false }],

    // list of files / patterns to exclude
    exclude: ['**/test/**/*.js', '**/*.test.js'],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/karma/**/*.js': ['webpack', 'sourcemap'],
      'assets/src/**/*.js': ['coverage'],
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      stats: 'errors-only',
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: config.coverage ? ['progress', 'coverage'] : ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['puppeteer'],

    puppeteerLauncher: {
      puppeteer: {
        headless: config.headless || false,
        slowMo: config.slowMo || 0,
        snapshots: config.snapshots || false,
      },
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browsers should be started simultaneously
    concurrency: Infinity,

    // Allow not having any tests
    failOnEmptyTestSuite: false,

    // Configure coverage output
    coverageReporter: {
      // specify a common output directory
      dir: 'build/logs/karma-coverage',
      includeAllSources: true,
      reporters: [
        { type: 'lcov', subdir: 'lcov-report' },
        { type: 'text-summary' },
      ],
    },
  });
};
