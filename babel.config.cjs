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

module.exports = function (api) {
  const isTest = api.env('test');
  const isProduction = api.env('production');

  const targets = isTest
    ? {
        node: 'current',
      }
    : undefined;

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          shippedProposals: true,
          targets,
          useBuiltIns: 'usage',
          corejs: require('core-js/package.json').version,
          // Remove some unnecessary polyfills, similar to how Gutenberg is handling that.
          // See https://github.com/WordPress/gutenberg/blob/e95970d888c309274e24324d593c77c536c9f1d8/packages/babel-preset-default/polyfill-exclusions.js.
          exclude: [
            'es.array.push',
            /^es(next)?\.set\./,
            /^es(next)?\.iterator\./,
          ],
        },
      ],
      [
        '@babel/preset-react',
        {
          // Not fully released yet, see https://github.com/facebook/react/pull/18299#issuecomment-603738136.
          //runtime: 'automatic',
          development: !isProduction,
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      ['babel-plugin-react-compiler', { target: '17' }],
      '@wordpress/babel-plugin-import-jsx-pragma',
      [
        'babel-plugin-styled-components',
        {
          meaninglessFileNames: ['index', 'styles', 'components'],
        },
      ],
    ],
    sourceMaps: true,
    env: {
      production: {
        plugins: ['transform-react-remove-prop-types'],
      },
    },
  };
};
