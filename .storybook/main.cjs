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
const webpack = require('webpack');

/**
 * Storybook Workaround: https://github.com/storybookjs/storybook/issues/14877#issuecomment-1000441696
 *
 * @param {string} filePath Original file path
 * @param {string} newExtension Extension to use (such as .cjs or .html)
 * @return {Object} updated path
 */
const replaceFileExtension = (filePath, newExtension) => {
  const { name, root, dir } = path.parse(filePath);
  return path.format({
    name,
    root,
    dir,
    ext: newExtension,
  });
};

module.exports = {
  stories: [
    './stories/**/*.js',
    '../packages/dashboard/src/**/stories/*.@(js|mdx)',
    '../packages/story-editor/src/**/stories/*.@(js|mdx)',
    '../packages/wp-dashboard/src/**/stories/*.@(js|mdx)',
    '../packages/wp-story-editor/src/**/stories/*.@(js|mdx)',
    '../packages/activation-notice/src/**/stories/*.@(js|mdx)',
    '../packages/design-system/src/**/stories/*.@(js|mdx)',
  ],
  addons: [
    '@storybook/addon-a11y/register',
    '@storybook/addon-essentials',
    '@storybook/addon-storysource/register',
  ],
  framework: '@storybook/react',
  core: {
    builder: 'webpack5',
  },
  //eslint-disable-next-line require-await -- Negligible.
  webpackFinal: async (config) => {
    // webpack < 5 used to include polyfills for node.js core modules by default.
    // Prevent ModuleNotFoundError for this dependency.
    config.resolve = {
      ...config.resolve,
      // Fixes resolving packages in the monorepo so we use the "src" folder, not "dist".
      // This should be sync'd with the config in `webpack.config.cjs`.
      exportsFields: ['customExports', 'exports'],
    };

    // Avoid having to provide full file extension for imports.
    // See https://webpack.js.org/configuration/module/#resolvefullyspecified

    config.module.rules = config.module.rules.map((rule) => ({
      ...rule,
      resolve: {
        ...rule.resolve,
        fullySpecified: false,
      },
    }));

    // These should be sync'd with the config in `webpack.config.cjs`.
    config.plugins.push(
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

    config.plugins.push(
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

    // Ensure SVGR is the only loader used for files with .svg extension.
    const assetRule = config.module.rules.find(({ test }) => test.test('.svg'));
    assetRule.exclude = /\.svg/;

    config.module.rules.unshift(
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
            issuer: /\.js?$/,
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
            issuer: /\.js?$/,
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

    /*
    Webpack + Storybook 6.4 - webpack crashing due to plugins
    that are compiled to CJS while project uses ESM.
    TODO: 10696: Remove with storybook 6.5
    */
    // https://github.com/storybookjs/storybook/issues/14877#issuecomment-1000441696

    // Find the plugin instance that needs to be mutated
    const virtualModulesPlugin = config.plugins.find(
      (plugin) => plugin.constructor.name === 'VirtualModulesPlugin'
    );

    // Change the file extension to .cjs for all files that end with "generated-stories-entry.js"
    virtualModulesPlugin._staticModules = Object.fromEntries(
      Object.entries(virtualModulesPlugin._staticModules).map(
        ([key, value]) => {
          if (key.endsWith('generated-stories-entry.js')) {
            return [replaceFileExtension(key, '.cjs'), value];
          }
          return [key, value];
        }
      )
    );

    // Change the entry points to point to the appropriate .cjs files
    config.entry = config.entry.map((entry) => {
      if (entry.endsWith('generated-stories-entry.js')) {
        return replaceFileExtension(entry, '.cjs');
      }
      return entry;
    });

    /* End storybook 6.4 non .cjs extension patch */

    return config;
  },
};
