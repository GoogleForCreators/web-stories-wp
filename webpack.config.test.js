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

/**
 * External dependencies
 */
import webpack from 'webpack';

/**
 * WordPress dependencies
 */
import DependencyExtractionWebpackPlugin from '@wordpress/dependency-extraction-webpack-plugin';

/**
 * Internal dependencies
 */
import webpackConfigArray from './webpack.config';

function getConfig(group, { coverage = false } = {}) {
  const config = webpackConfigArray
    .filter((webpackConfig) => group in webpackConfig.entry)
    .map((webpackConfig) => ({
      ...webpackConfig,
      // Karma watches the test entry points, so we don't need to specify
      // them here. Webpack watches dependencies.
      entry: undefined,
      mode: 'development',
      devtool: 'inline-source-map',
      plugins: [
        // WP's DependencyExtractionWebpackPlugin is not needed for tests and
        // otherwise has some failures.
        ...webpackConfig.plugins.filter(
          (plugin) => !(plugin instanceof DependencyExtractionWebpackPlugin)
        ),
        // React Testing Library checks for this variable, but webpack does
        // no longer polyfill `process` in the browser.
        new webpack.DefinePlugin({
          'process.env.RTL_SKIP_AUTO_CLEANUP': false,
        }),
      ],
    }))[0];
  if (coverage) {
    config.module.rules.push({
      enforce: 'post',
      test: /\.js$/,
      exclude: [/\/karma\//, /\.karma\.js$/, /\.test\.js$/, /node_modules/],
      use: '@jsdevtools/coverage-istanbul-loader',
    });
  }
  return config;
}

export default getConfig;
