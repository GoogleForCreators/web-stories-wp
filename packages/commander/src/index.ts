#!/usr/bin/env bun
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
import { mkdirSync, rmSync, existsSync } from 'fs';
import { relative } from 'path';
import { Command } from 'commander';
import { inc as semverInc, ReleaseType } from 'semver';

/**
 * Internal dependencies
 */
import {
  bundlePlugin,
  createBuild,
  getCurrentVersionNumber,
  updateVersionNumbers,
  updateCdnUrl,
  resizeSvgPath,
} from './utils';

const PLUGIN_DIR = process.cwd();
const PLUGIN_FILE = 'web-stories.php';
const BUILD_DIR = 'build/web-stories';

const program = new Command();

program
  .command('version')
  .description('Bump the version of the plugin')
  .argument('version', 'The desired version number.')
  .option(
    '--nightly',
    'Whether this is a nightly build and thus should append the current revision to the version number.'
  )
  .option(
    '--increment <level>',
    `Increment a version by the specified level. Level can
be one of: major, minor, patch, premajor, preminor,
prepatch, or prerelease. Only one version may be specified.`
  )
  .option(
    '--preid <identifier>',
    `Identifier to be used to prefix premajor, preminor, prepatch or prerelease version increments.`,
    'alpha'
  )
  .on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('  # Prepare stable release');
    console.log('  $ index.js version 1.2.3');
    console.log('');
    console.log('  # Nightly build');
    console.log('  $ index.js version --nightly');
  })
  .action(
    (
      version: string,
      {
        nightly,
        increment,
        preid,
      }: { nightly: boolean; increment: ReleaseType; preid: string }
    ) => {
      const pluginFilePath = `${PLUGIN_DIR}/${PLUGIN_FILE}`;

      const currentVersion = getCurrentVersionNumber(pluginFilePath);
      let newVersion: string | null = version || currentVersion;

      if (increment) {
        newVersion = semverInc(
          currentVersion,
          increment,
          undefined,
          preid
        ) as string;
      }

      updateVersionNumbers(pluginFilePath, newVersion, nightly);
      const constantVersion = getCurrentVersionNumber(pluginFilePath, true);

      console.log(
        `Version number successfully updated! New version: ${constantVersion}`
      );
    }
  );

program
  .command('build-plugin')
  .option(
    '--composer',
    'Create Composer-ready build. Does not contain PHP autoloader.'
  )
  .option(
    '--zip [filename]',
    'Generate a ready-to-use ZIP file. Optionally specify a file name.'
  )
  .option(
    '--clean',
    'Delete existing ZIP files in the build/ folder prior to bundling.'
  )
  .description('Build Web Stories plugin')
  .on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('  # Create a ZIP-file ready to install in WordPress');
    console.log('  $ index.js build-plugin --zip');
    console.log('');
    console.log('  # Remove existing ZIP files before creating one');
    console.log('  $ index.js build-plugin --zip --clean');
    console.log('');
    console.log(
      '  # Create a custom-named ZIP-file ready to use with Composer'
    );
    console.log('  $ index.js build-plugin --composer --zip web-stories.zip');
  })
  .action(
    ({
      composer,
      zip,
      clean,
    }: {
      composer: boolean;
      zip: string | boolean;
      clean: boolean;
    }) => {
      const buildDirPath = `${PLUGIN_DIR}/${BUILD_DIR}`;

      // Make sure build directory exists and is empty.
      if (existsSync(BUILD_DIR)) {
        rmSync(BUILD_DIR, { recursive: true, force: true });
      }
      mkdirSync(BUILD_DIR, { recursive: true });

      createBuild(PLUGIN_DIR, buildDirPath, composer);

      let build = BUILD_DIR;

      if (zip) {
        build = bundlePlugin(buildDirPath, composer, zip, clean);
      }

      console.log(
        `Plugin successfully built! Location: ${relative(process.cwd(), build)}`
      );
    }
  );

program
  .command('assets-version')
  .description('Change the CDN assets version used by the plugin')
  .argument('version', 'Assets version. Either `main` or an integer.')
  .on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log(
      '  # Change assets version to `main` (default, for development builds)'
    );
    console.log('  $ commander.js assets-version main');
    console.log('');
    console.log('  # Change assets version for stable release');
    console.log('  $ commander.js assets-version 7');
  })
  .action((version: string) => {
    const pluginFilePath = `${PLUGIN_DIR}/${PLUGIN_FILE}`;
    updateCdnUrl(
      pluginFilePath,
      version === 'main' ? version : parseInt(version)
    );

    console.log(`Assets CDN URL successfully updated!`);
  });

program
  .command('normalize-path')
  .description('Normalize SVG paths for shapes')
  .argument('width', 'Viewbox width')
  .argument('height', 'Viewbox height')
  .argument('path', 'Path to normalize')
  .on('--help', () => {
    console.log('');
    console.log('Example:');
    console.log('  $ commander.js normalize-path 392 392 "M10 10"');
  })
  .action((width: string, height: string, path: string) => {
    console.log(resizeSvgPath(Number(width), Number(height), path));
  });

program.parse(process.argv);
