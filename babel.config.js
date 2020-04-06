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
  const isTestEnvironment = api.env() === 'test';

  const targets = isTestEnvironment
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
          corejs: 3,
        },
      ],
      [
        '@babel/preset-react',
        {
          // Not fully released yet, see https://github.com/facebook/react/pull/18299#issuecomment-603738136.
          //runtime: 'automatic',
        },
      ],
    ],
    plugins: ['babel-plugin-styled-components'],
    sourceMaps: true,
    env: {
      development: {
        presets: [
          [
            '@babel/preset-react',
            {
              development: true,
            },
          ],
        ],
      },
      production: {
        plugins: ['transform-react-remove-prop-types'],
      },
    },
  };
};
