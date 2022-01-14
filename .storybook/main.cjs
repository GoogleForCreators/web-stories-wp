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
    '@storybook/addon-actions',
    '@storybook/addon-docs',
    '@storybook/addon-knobs',
    '@storybook/addon-storysource/register',
    '@storybook/addon-viewport/register',
    '@storybook/addon-backgrounds/register',
    'storybook-rtl-addon',
  ],
  reactOptions: {
    fastRefresh: true,
    strictMode: true,
  },
  //eslint-disable-next-line require-await
  webpackFinal: async (config) => {
    // Modifies storybook's webpack config to use svgr instead of file-loader.
    // see https://github.com/storybookjs/storybook/issues/5613

    const assetRule = config.module.rules.find(({ test }) => test.test('.svg'));
    const assetLoader = {
      loader: assetRule.loader,
      options: assetRule.options || assetRule.query,
    };

    // These should be sync'd with the config in `webpack.config.cjs`.
    config.module.rules.unshift(
      {
        test: /\.svg$/,
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
                    removeViewBox: false,
                    removeDimensions: true,
                    convertColors: {
                      currentColor: /^(?!url|none)/i,
                    },
                  },
                ],
              },
            },
          },
          'url-loader',
          assetLoader,
        ],
        exclude: [/images\/.*\.svg$/],
      },
      {
        test: /\.svg$/,
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
                    removeViewBox: false,
                    removeDimensions: true,
                    convertColors: {
                      // See https://github.com/google/web-stories-wp/pull/6361
                      currentColor: false,
                    },
                  },
                ],
              },
            },
          },
          'url-loader',
        ],
        include: [/images\/.*\.svg$/],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images',
            },
          },
        ],
      }
    );

    // only the first matching rule is used when there is a match.
    config.module.rules = [{ oneOf: config.module.rules }];

    return config;
  },
};
