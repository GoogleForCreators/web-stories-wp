#!/usr/bin/env node
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

/* eslint-disable no-console */

/**
 * External dependencies
 */
import { mkdirSync, rmdirSync } from 'fs';
import program from 'commander';

/**
 * Internal dependencies
 */
import {
  bundlePlugin,
  buildFonts,
  getCurrentVersionNumber,
  updateVersionNumbers,
  updateAssetsURL,
} from './utils/index.js';

const PLUGIN_DIR = process.cwd();
const PLUGIN_FILE = `${PLUGIN_DIR}/web-stories.php`;
const README_FILE = `${PLUGIN_DIR}/readme.txt`;
const PLUGIN_BUILD_DIR = `${PLUGIN_DIR}/build/web-stories`;
const FONTS_FILE = PLUGIN_DIR + '/includes/data/fonts.json';

program
  .command('version')
  .arguments('[version]')
  .option(
    '--nightly',
    'Whether this is a nightly build and thus should append the current revision to the version number.'
  )
  .description('Bump the version of the plugin')
  .on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('  # Prepare stable release');
    console.log('  $ commander.js version 1.2.3');
    console.log('');
    console.log('  # Nightly build');
    console.log('  $ commander.js version --nightly');
  })
  .action((version, { nightly }) => {
    const currentVersion = getCurrentVersionNumber(PLUGIN_FILE);
    const newVersion = version || currentVersion;

    updateVersionNumbers(PLUGIN_FILE, README_FILE, newVersion, nightly);
    const constantVersion = getCurrentVersionNumber(PLUGIN_FILE, true);

    console.log(
      `Version number successfully updated! New version: ${constantVersion}`
    );
  });

program
  .command('build-plugin')
  .option(
    '--composer',
    'Create Composer-ready build. Does not contain PHP autoloader.'
  )
  .option(
    '--cdn [url]',
    'Load any static assets from CDN. With optional URL provided.'
  )
  .option(
    '--zip [filename]',
    'Load any static assets from CDN. With optional URL provided.'
  )
  .option(
    '--clean',
    'Delete existing ZIP files in the build/ folder prior to bundling.'
  )
  .description('Build Web Stories plugin')
  .on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('  # Build plugin and point assets to CDN');
    console.log('  $ commander.js build-plugin --cdn');
    console.log('');
    console.log('  # Create a ZIP-file ready to install in WordPress');
    console.log('  $ commander.js build-plugin --cdn --zip');
    console.log('');
    console.log('  # Remove existing ZIP files before creating one');
    console.log('  $ commander.js build-plugin --zip --clean');
    console.log('');
    console.log(
      '  # Create a custom-named ZIP-file ready to use with Composer'
    );
    console.log(
      '  $ commander.js build-plugin --composer --zip web-stories.zip'
    );
  })
  .action(({ composer, cdn, zip, clean }) => {
    if (cdn) {
      updateAssetsURL(PLUGIN_FILE, cdn === true ? undefined : cdn);
    }

    // Make sure build directory exists and is empty.
    rmdirSync(PLUGIN_BUILD_DIR, { recursive: true });
    mkdirSync(PLUGIN_BUILD_DIR, { recursive: true });

    const build = bundlePlugin(PLUGIN_DIR, composer, zip, clean, cdn);

    console.log(`Plugin successfully built! Location: ${build}`);
  });

program
  .command('build-fonts')
  .description('Download latest set of fonts from Google Fonts')
  .on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('  # Generate the web fonts list');
    console.log('  $ commander.js build-fonts');
  })
  .action(async () => {
    if (!process.env.GOOGLE_FONTS_API_KEY) {
      console.error('Google Fonts API key missing!');
      return;
    }

    try {
      await buildFonts(FONTS_FILE);
    } catch (err) {
      console.error('There was an error generating the web fonts list:', err);
      return;
    }

    console.log('Web fonts updated!');
  });

program.parse(process.argv);

/* eslint-enable no-console */
