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

/**
 * External dependencies
 */
import { resolve as resolvePath, dirname } from 'path';
import { fileURLToPath } from 'url';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import url from '@rollup/plugin-url';
import json from '@rollup/plugin-json';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import svgr from '@svgr/rollup';
import terser from '@rollup/plugin-terser';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';
import workspacesRun from 'workspaces-run';

const __dirname = fileURLToPath(dirname(import.meta.url));

const plugins = [
  resolve({
    browser: true, // To correctly import browser version of @ffmpeg/ffmpeg for example.
    preferBuiltins: true,
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json'],
  }),
  babel({
    babelrc: false,
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs'],
    babelHelpers: 'inline',
    exclude: 'node_modules/**',
    presets: ['@babel/env', '@babel/preset-react', '@babel/preset-typescript'],
    plugins: [
      'babel-plugin-styled-components',
      [
        'babel-plugin-transform-react-remove-prop-types',
        {
          removeImport: true,
        },
      ],
    ],
  }),
  url({
    include: '**/inline-icons/*.svg',
  }),
  svgr({
    include: '**/icons/*.svg',
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
  }),
  svgr({
    include: '**/images/*.svg',
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
  }),
  commonjs(),
  json({
    compact: true,
  }),
  dynamicImportVars(),
  webWorkerLoader({
    inline: true,
    preserveSource: true,
    'web-worker': /\.worker\.js$/,
  }),
  terser({
    // We preserve function names that start with capital letters as
    // they're _likely_ component names, and these are useful to have
    // in tracebacks and error messages.
    keep_fnames: /__|_x|_n|_nx|sprintf|^[A-Z].+$/,
    output: {
      comments: /translators:/i,
    },
    mangle: {
      reserved: ['__', '_x', '_n', '_nx', 'sprintf'],
    },
  }),
];

/**
 * @typedef {Object} CustomInputOptions
 * @property {string} configPackages Comma-separated list of package names to include.
 * @property {string} configEntries Comma-separated list of entries to build. Supports "es" and "cjs".
 * @typedef {import('rollup').RollupOptions & CustomInputOptions} CustomInputOptions
 */

/**
 * Main rollup configuration for building npm packages.
 *
 * To build only a subset of all public packages, run:
 *
 * `npx rollup -c --configPackages=i18n,fonts`
 *
 * @param {CustomInputOptions} cliArgs CLI arguments.
 * @return {import('rollup').RollupOptions} Rollup configuration.
 */
async function config(cliArgs) {
  const packages = [];
  const entries = [];

  // Collect the list of packages
  await workspacesRun({ cwd: __dirname, orderByDeps: true }, (pkg) => {
    if (!pkg.config.private) {
      packages.push(pkg);
    }
  });

  const allPackageNames = packages.map(({ name }) => name.split('/')[1]);
  const packagesToBuild = cliArgs?.configPackages
    ? cliArgs.configPackages.split(',')
    : allPackageNames;
  const entriesToBuild = cliArgs?.configEntries
    ? cliArgs.configEntries.split(',')
    : ['es', 'cjs'];

  for (const pkg of packages) {
    if (!packagesToBuild.includes(pkg.name.split('/')[1])) {
      continue;
    }

    const input = resolvePath(pkg.dir, pkg.config.source);

    const external = [
      ...new Set([
        ...Object.keys(pkg.config.dependencies || {}),
        ...Object.keys(pkg.config.peerDependencies || {}),
        'react',
        'react-dom',
        'react-dom/server',
        /@babel\/runtime/,
        /node_modules/,
      ]),
    ];

    const output = {
      sourcemap: true,
      exports: 'auto',
      preserveModules: true,
      banner: `/*
 * Copyright ${new Date().getFullYear()} Google LLC
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
 */`,
    };

    const sourceDir = dirname(resolvePath(pkg.dir, pkg.config.source));

    if (entriesToBuild.includes('es')) {
      const _plugins = [];

      const moduleDir = dirname(resolvePath(pkg.dir, pkg.config.module));
      _plugins.push(
        del({
          targets: [moduleDir],
          runOnce: false !== cliArgs.watch,
        })
      );

      if ('@googleforcreators/fonts' === pkg.name) {
        _plugins.push(
          copy({
            targets: [{ src: `${sourceDir}/fonts.json`, dest: moduleDir }],
          })
        );
      }

      entries.push({
        input,
        output: {
          ...output,
          dir: moduleDir,
          format: 'es',
        },
        plugins: [...plugins, ..._plugins],
        external,
        context: 'window',
      });
    }

    if (entriesToBuild.includes('cjs')) {
      const _plugins = [];

      const mainDir = dirname(resolvePath(pkg.dir, pkg.config.main));
      _plugins.push(
        del({
          targets: [mainDir],
          runOnce: false !== cliArgs.watch,
        })
      );

      if ('@googleforcreators/fonts' === pkg.name) {
        _plugins.push(
          copy({
            targets: [{ src: `${sourceDir}/fonts.json`, dest: mainDir }],
          })
        );
      }

      entries.push({
        input,
        output: {
          ...output,
          dir: mainDir,
          format: 'cjs',
        },
        plugins: [...plugins, ..._plugins],
        external,
        context: 'window',
      });
    }
  }

  return entries;
}

export default config;
