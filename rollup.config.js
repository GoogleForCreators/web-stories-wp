/*
 * Copyright 2022 Google LLC
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

/* global __dirname */

/**
 * External dependencies
 */
import { resolve as resolvePath, dirname } from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import svgr from '@svgr/rollup';
import filesize from 'rollup-plugin-filesize';
import css from 'rollup-plugin-import-css';
import url from '@rollup/plugin-url';
import json from 'rollup-plugin-json';
import license from 'rollup-plugin-license';
import workspacesRun from 'workspaces-run';

/**
 * Internal dependencies
 */

const plugins = [
  resolve({
    preferBuiltins: true,
    dedupe: [],
  }),
  babel({
    babelHelpers: 'inline',
    exclude: 'node_modules/**',
    presets: ['@babel/env', '@babel/preset-react'],
    plugins: [
      'babel-plugin-styled-components',
      'babel-plugin-inline-json-import',
    ],
  }),
  url(),
  svgr(),
  commonjs(),
  json(),
  css(),
  terser(),
  license({
    sourcemap: true,
    banner: `Copyright <%= moment().format('YYYY') %> Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.`,
  }),
  filesize(),
];

export default (async () => {
  const packages = [];
  const entries = [];

  // Collect the list of packages
  await workspacesRun({ cwd: __dirname, orderByDeps: true }, (pkg) => {
    if (!pkg.config.private) {
      packages.push(pkg);
    }
  });

  for (const pkg of packages) {
    const input = resolvePath(pkg.dir, pkg.config.source);

    const external = [
      ...new Set([
        ...Object.keys(pkg.config.peerDependencies || {}),
        'react',
        'react-dom',
        'react-dom/server',
        /@babel\/runtime/,
      ]),
    ];

    console.log(external);

    entries.push({
      input,
      output: {
        dir: dirname(resolvePath(pkg.dir, pkg.config.module)),
        format: 'es',
      },
      plugins,
      external,
    });

    entries.push({
      input,
      output: {
        dir: dirname(resolvePath(pkg.dir, pkg.config.main)),
        format: 'cjs',
      },
      plugins,
      external,
    });
  }

  return entries;
})();
