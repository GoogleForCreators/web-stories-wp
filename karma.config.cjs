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

/**
 * Internal dependencies
 */
const webpackConfig = require('./webpack.config.test.cjs');

module.exports = function (config) {
  config.set({
    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-sourcemap-loader',
      'karma-webpack',
      require('./karma/karma-puppeteer-launcher/index.cjs'),
      require('./karma/karma-puppeteer-client/index.cjs'),
    ],

    // Frameworks to use.
    // Available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'karma-puppeteer-client'],

    // list of files / patterns to load in the browser
    files: [
      { pattern: 'assets/src/edit-story/**/karma/**/*.js', watched: false },
      {
        pattern: '__static__/**/*',
        watched: false,
        included: false,
        served: true,
        nocache: false,
      },
    ],

    // list of files / patterns to exclude
    exclude: ['**/test/**/*.js'],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'assets/src/edit-story/**/karma/**/*.js': ['webpack', 'sourcemap'],
    },

    proxies: {
      '/__static__/': '/base/__static__/',
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
    reporters: ['progress'],

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
        devtools: config.devtools || false,
        snapshots: config.snapshots || false,
        // @todo: consider testing on a couple of canonical viewport sizes.
        // Per Figma, the canonical sizes are:
        // Desktop: 1920:1080
        // iPad: 1024:680
        defaultViewport: null,
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
  });
};
