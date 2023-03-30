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
import { dirname, resolve as resolvePath } from 'path';
import { fileURLToPath } from 'url';
import resolve from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';

const __dirname = fileURLToPath(dirname(import.meta.url));

export default {
  input: resolvePath(__dirname, 'src/index.ts'),
  output: {
    file: resolvePath(__dirname, 'scripts/module.js'),
    format: 'es',
  },
  plugins: [
    resolve({
      preferBuiltins: true,
      extensions: ['.ts'],
    }),
    babel({
      babelrc: false,
      extensions: ['.ts'],
      babelHelpers: 'inline',
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env', '@babel/preset-typescript'],
    }),
  ],
  external: ['crypto'],
};
