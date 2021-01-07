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
 * External dependencies
 */
const { readFileSync } = require('fs');

/**
 * Internal dependencies
 */
const getWebpackConfig = require('./webpack.config.test.cjs');

module.exports = function (config) {
  let specsToRetry;
  if (config.retryFailed) {
    // Loads names of failed specs and prepares them for use in a regex.
    specsToRetry = readFileSync(
      'build/karma-dashboard-failed-tests.txt',
      'utf-8'
    )
      .replace(/\s+$/g, '')
      .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
      .replace(/-/g, '\\x2d')
      .split('\n')
      .join('|');
  }

  config.set({
    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-spec-reporter',
      'karma-coverage-istanbul-reporter',
      require('./packages/karma-puppeteer-launcher/src/index.cjs'),
      require('./packages/karma-puppeteer-client/src/index.cjs'),
      require('./packages/karma-cuj-reporter/src/index.cjs'),
      require('./packages/karma-failed-tests-reporter/src/index.cjs'),
    ],

    // Frameworks to use.
    // Available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'karma-puppeteer-client'],

    // list of files / patterns to load in the browser
    files: [
      { pattern: 'assets/src/dashboard/karma-tests.cjs', watched: false },
      { pattern: 'assets/src/karma-fixture/init.js', watched: false },
      {
        pattern: '__static__/**/*',
        watched: false,
        included: false,
        served: true,
        nocache: false,
      },
      'node_modules/axe-core/axe.js',
    ],

    // list of files / patterns to exclude
    exclude: ['**/test/**/*.js', '**/*.test.js'],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'assets/src/dashboard/karma-tests.cjs': ['webpack', 'sourcemap'],
    },

    proxies: {
      '/__static__/': '/base/__static__/',
    },

    webpack: getWebpackConfig('stories-dashboard', config),

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      stats: 'errors-only',
    },

    webpackServer: {
      noInfo: true,
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [
      'spec',
      'failed-tests',
      config.coverage && 'cuj',
      config.coverage && 'coverage-istanbul',
    ].filter(Boolean),

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
        defaultViewport: getViewport(config.viewport),
      },
    },

    client: {
      args: [
        specsToRetry && '--grep',
        specsToRetry && `/${specsToRetry}/`,
      ].filter(Boolean),
      jasmine: {
        timeoutInterval: 10000,
      },
      useIframe: false,
      runInParent: true,
    },

    coverageIstanbulReporter: {
      dir: 'build/logs/karma-coverage/dashboard',
      reports: ['text-summary', 'lcovonly'],
    },

    cujReporter: {
      outputFile: 'build/cuj-coverage-dashboard.md',
    },

    failedTestsReporter: {
      outputFile: 'build/karma-dashboard-failed-tests.txt',
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browsers should be started simultaneously
    concurrency: Infinity,

    // Allow not having any tests
    failOnEmptyTestSuite: false,

    // Prevent duplicate logging to console
    browserConsoleLogOptions: {
      terminal: false,
    },

    // Bump browserNoActivityTimeout to 100s to prevent Github Actions timeout
    browserNoActivityTimeout: 100000,

    // Wait a bit longer for browser to reconnect.
    browserDisconnectTimeout: 10000,

    // Custom context file.
    customClientContextFile:
      'assets/src/karma-fixture/client_with_context.html',
  });
};

/**
 * Returns a viewport object for  a given flag.
 *
 * The following viewports are supported:
 * - default: no special viewport is used.
 * - 1600:1000: empirical laptop size. Also used for screenshots.
 *
 * A custom W:H viewport is intentionally not supported to reduce number of
 * test variations.
 *
 * Todo: Support the viewport sizes from Figma:
 * - 1920:1080: the canonical desktop size.
 * - 1024:680: the canonical iPad size.
 *
 * @param {string} flag Viewport flag.
 * @return {{width: number, height: number}|null} Viewport.
 */
function getViewport(flag) {
  if (!flag) {
    // @todo: switch to 1600:1000 default once Percy is fully launched.
    return null;
  }
  if (flag === '1600:1000') {
    return { width: 1600, height: 1000 };
  }
  throw new Error(`Unsupported viewport: "${flag}"`);
}
