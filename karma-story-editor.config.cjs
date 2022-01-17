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
      'build/karma-story-editor-failed-tests.txt',
      'utf-8'
    )
      .replace(/\s+$/g, '')
      .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
      .replace(/-/g, '\\x2d')
      .split('\n')
      .join('|');
  }

  let totalShards = 1;
  let shardNumber = 1;
  if (config.shard) {
    [shardNumber, totalShards] = config.shard.split('/');
  }
  const shardIndex = shardNumber - 1;

  const enableParallelRuns = config.shard || config.parallel;
  // Default is number of CPU cores minus 1.
  const parallelExecutors =
    config.parallel && true !== config.parallel
      ? Number(config.parallel)
      : undefined;

  config.set({
    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-coverage-istanbul-reporter',
      'karma-parallel',
      require('@web-stories-wp/karma-puppeteer-launcher'),
      require('@web-stories-wp/karma-puppeteer-client'),
      require('@web-stories-wp/karma-failed-tests-reporter'),
    ],

    // Frameworks to use.
    // Available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      enableParallelRuns && 'parallel',
      'jasmine',
      '@web-stories-wp/karma-puppeteer-client',
    ].filter(Boolean),

    // list of files / patterns to load in the browser
    files: [
      { pattern: 'packages/story-editor/src/karma-tests.cjs', watched: false },
      { pattern: 'packages/karma-fixture/src/init.js', watched: false },
      {
        pattern: '__static__/**/*',
        watched: false,
        included: false,
        served: true,
        nocache: false,
      },
      // eslint-disable-next-line prettier/prettier, no-useless-escape
      '^https:\/\/fonts.googleapis.com\/css*',
      'node_modules/axe-core/axe.js',
    ],
    // list of files / patterns to exclude
    exclude: ['**/test/**/*.js', '**/*.test.js'],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'packages/story-editor/src/karma-tests.cjs': ['webpack', 'sourcemap'],
    },

    proxies: {
      '/__static__/': '/base/__static__/',
    },

    webpack: getWebpackConfig('wp-story-editor', config),

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
      'dots',
      '@web-stories-wp/karma-failed-tests-reporter',
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
    browsers: ['karma-puppeteer-launcher'], // @web-stories-wp/karma-puppeteer-launcher package

    puppeteerLauncher: {
      puppeteer: {
        headless: config.headless || false,
        slowMo: config.slowMo || 0,
        devtools: config.devtools || false,
        snapshots: config.snapshots || false,
        snapshotsDir: '.test_artifacts/karma_snapshots',
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
      dir: 'build/logs/karma-coverage/story-editor',
      reports: ['text-summary', 'lcovonly'],
    },

    failedTestsReporter: {
      outputFile: 'build/karma-story-editor-failed-tests.txt',
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browsers should be started simultaneously
    concurrency: Infinity,

    // Sharding configuration for CI.
    // We trick karma-parallel into using only 1 browser (parallelOptions.executors === 1)
    // while using a custom strategy that splits up the tests into multiple shards (config.executors > 1).
    // This allows us to run ony a subset of the tests like so:
    // npm run test:karma:story-editor -- --headless --shard=1/3 # Run the first of 3 desired shards.
    parallelOptions: {
      shardStrategy: config.shard ? 'custom' : 'round-robin',
      // If we're using custom sharding, just spin up 1 browser,
      // but do the splitting in the custom strategy below.
      executors: config.shard ? 1 : parallelExecutors,
      // Re-implements a round-robin strategy, but with a custom shardIndex.
      // Need to use the Function constructor here so we have access to the outer shardIndex and totalShards vars,
      // because karma-parallel serializes this function.
      // eslint-disable-next-line no-new-func
      customShardStrategy: new Function(
        'parallelOptions',
        `
        window.parallelDescribeCount = window.parallelDescribeCount || 0;
        window.parallelDescribeCount++;
        const shouldRunThisTest = (window.parallelDescribeCount % ${totalShards} === ${shardIndex});
        return shouldRunThisTest;
      `
      ),
    },

    // Allow not having any tests
    failOnEmptyTestSuite: false,

    // Prevent duplicate logging to console
    browserConsoleLogOptions: {
      terminal: false,
    },

    // When a browser crashes,try to relaunch more than just 2 times (which is the default)
    retryLimit: 5,

    // Bump browserNoActivityTimeout to 100s to prevent Github Actions timeout
    browserNoActivityTimeout: 100000,

    // Wait a bit longer for browser to reconnect.
    browserDisconnectTimeout: 10000,

    // Custom context file.
    customClientContextFile:
      'packages/karma-fixture/src/client_with_context.html',
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
