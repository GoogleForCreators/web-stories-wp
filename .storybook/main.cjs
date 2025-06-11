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
const { readFileSync } = require('fs');
const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');
// eslint-disable-next-line node/no-missing-require
const { loadCsf } = require('storybook/internal/csf-tools');

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
module.exports = {
  stories: [
    './stories/playground/*/(index|preview).js',
    '../packages/dashboard/src/**/stories/index.js',
    '../packages/story-editor/src/**/stories/index.js',
    '../packages/wp-dashboard/src/**/stories/index.js',
    '../packages/activation-notice/src/**/stories/index.js',
    '../packages/design-system/src/**/stories/index.js',
    '../packages/animation/src/**/stories/*.js',
  ],

  experimental_indexers: (indexers) => {
    const createIndex = (fileName, opts) => {
      const code = readFileSync(fileName, {
        encoding: 'utf-8',
      });
      return loadCsf(code, {
        ...opts,
        fileName,
      }).parse().indexInputs;
    };
    return [
      {
        test: /stories\/.*\.js$/,
        createIndex,
      },
      ...(indexers || []),
    ];
  },

  addons: [
    '@storybook/addon-a11y/register',
    '@storybook/addon-webpack5-compiler-babel',
  ],

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  core: {
    disableTelemetry: true,
  },

  docs: {
    disabled: true,
  },

  //eslint-disable-next-line require-await -- Negligible.
  webpackFinal: async (webpackConfig) => {
    // webpack < 5 used to include polyfills for node.js core modules by default.
    // Prevent ModuleNotFoundError for this dependency.
    webpackConfig.resolve = {
      ...webpackConfig.resolve,
      // Fixes resolving packages in the monorepo so we use the "src" folder, not "dist".
      // This should be sync'd with the config in `webpack.config.cjs`.
      exportsFields: ['customExports', 'exports'],
      // To make loading mediainfo.js work.
      fallback: {
        fs: false,
        path: false,
        url: false,
        module: false,
        assert: false,
        perf_hooks: false,
        crypto: false,
        worker_threads: false,
      },
    };

    // Avoid having to provide full file extension for imports.
    // See https://webpack.js.org/configuration/module/#resolvefullyspecified

    webpackConfig.module.rules = webpackConfig.module.rules.map((rule) => ({
      ...rule,
      resolve: {
        ...rule.resolve,
        fullySpecified: false,
      },
    }));

    // These should be sync'd with the config in `webpack.config.cjs`.
    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        WEB_STORIES_CI: JSON.stringify(process.env.CI),
        WEB_STORIES_ENV: JSON.stringify(process.env.NODE_ENV),
        WEB_STORIES_DISABLE_ERROR_BOUNDARIES: JSON.stringify(
          process.env.DISABLE_ERROR_BOUNDARIES
        ),
        WEB_STORIES_DISABLE_OPTIMIZED_RENDERING: JSON.stringify(
          process.env.DISABLE_OPTIMIZED_RENDERING
        ),
        WEB_STORIES_DISABLE_PREVENT: JSON.stringify(
          process.env.DISABLE_PREVENT
        ),
        WEB_STORIES_DISABLE_QUICK_TIPS: JSON.stringify(
          process.env.DISABLE_QUICK_TIPS
        ),
      })
    );

    // These should be sync'd with the config in `webpack.config.cjs`.
    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        WEB_STORIES_CI: JSON.stringify(process.env.CI),
        WEB_STORIES_ENV: JSON.stringify(process.env.NODE_ENV),
        WEB_STORIES_DISABLE_ERROR_BOUNDARIES: JSON.stringify(
          process.env.DISABLE_ERROR_BOUNDARIES
        ),
        WEB_STORIES_DISABLE_OPTIMIZED_RENDERING: JSON.stringify(
          process.env.DISABLE_OPTIMIZED_RENDERING
        ),
        WEB_STORIES_DISABLE_PREVENT: JSON.stringify(
          process.env.DISABLE_PREVENT
        ),
        WEB_STORIES_DISABLE_QUICK_TIPS: JSON.stringify(
          process.env.DISABLE_QUICK_TIPS
        ),
      })
    );
    webpackConfig.plugins.push(
      new CircularDependencyPlugin({
        // exclude detection of files based on a RegExp
        exclude: /a\.js|node_modules/,
        // add errors to webpack instead of warnings
        failOnError: true,
        // allow import cycles that include an asynchronous import,
        // e.g. via import(/* webpackMode: "weak" */ 'file.js')
        allowAsyncCycles: false,
        // set the current working directory for displaying module paths
        cwd: process.cwd(),
      })
    );

    // Ensure SVGR is the only loader used for files with .svg extension.
    const assetRule = webpackConfig.module.rules.find(({ test }) => {
      if (!test) {
        return false;
      }
      if (Array.isArray(test)) {
        return test.every((t) => t.test('.svg'));
      }
      return test.test('.svg');
    });
    assetRule.exclude = /\.svg/;
    webpackConfig.module.rules.unshift(
      {
        test: /\.svg$/,
        // Use asset SVG and SVGR together.
        // Not using resourceQuery because it doesn't work well with Rollup.
        // https://react-svgr.com/docs/webpack/#use-svgr-and-asset-svg-in-the-same-project
        oneOf: [
          {
            type: 'asset/inline',
            include: [/inline-icons\/.*\.svg$/],
          },
          {
            issuer: /\.[jt]sx?$/,
            include: [/\/icons\/.*\.svg$/],
            use: [
              {
                loader: '@svgr/webpack',
                options: {
                  titleProp: true,
                  svgo: true,
                  memo: true,
                  svgoConfig: {
                    plugins: [
                      {
                        name: 'preset-default',
                        params: {
                          overrides: {
                            removeViewBox: false,
                            convertColors: {
                              currentColor: /^(?!url|none)/i,
                            },
                          },
                        },
                      },
                      'removeDimensions',
                    ],
                  },
                },
              },
            ],
          },
          {
            issuer: /\.[jt]sx?$/,
            include: [/images\/.*\.svg$/],
            use: [
              {
                loader: '@svgr/webpack',
                options: {
                  titleProp: true,
                  svgo: true,
                  memo: true,
                  svgoConfig: {
                    plugins: [
                      {
                        name: 'preset-default',
                        params: {
                          overrides: {
                            removeViewBox: false,
                            convertColors: {
                              // See https://github.com/googleforcreators/web-stories-wp/pull/6361
                              currentColor: false,
                            },
                          },
                        },
                      },
                      'removeDimensions',
                    ],
                  },
                },
              },
            ],
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          outputPath: 'images/',
        },
      }
    );
    return webpackConfig;
  },

  features: {
    actions: true,
    backgrounds: true,
    controls: false,
    viewport: true,
    toolbars: true,
  },
};
