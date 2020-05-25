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
const path = require('path');

/**
 * WordPress dependencies
 */
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');

/**
 * Internal dependencies
 */
const webpackConfigArray = require('./webpack.config');

module.exports = webpackConfigArray
  .filter((webpackConfig) => 'edit-story' in webpackConfig.entry)
  .map((webpackConfig) => ({
    ...webpackConfig,
    // Karma watches the test entry points, so we don't need to specify
    // them here. Webpack watches dependencies.
    entry: null,
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
      ...webpackConfig.output,
      path: path.resolve(process.cwd(), 'assets', 'testjs'),
    },
    // WP's DependencyExtractionWebpackPlugin is not needed for tests and
    // otherwise has some failures.
    plugins: webpackConfig.plugins.filter(
      (plugin) => !(plugin instanceof DependencyExtractionWebpackPlugin)
    ),
  }))[0];
