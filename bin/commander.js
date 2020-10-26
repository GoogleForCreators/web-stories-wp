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
import { relative } from 'path';
import program from 'commander';

/**
 * Internal dependencies
 */
import {
  bundlePlugin,
  buildFonts,
  createBuild,
  getCurrentVersionNumber,
  updateVersionNumbers,
  updateTemplates,
} from './utils/index.js';

const PLUGIN_DIR = process.cwd();
const PLUGIN_FILE = 'web-stories.php';
const README_FILE = 'readme.txt';
const FONTS_FILE = 'assets/src/fonts/fonts.json';
const BUILD_DIR = 'build/web-stories';
const TEMPLATES_DIR = `${PLUGIN_DIR}/assets/src/dashboard/templates/raw`;
const STORIES_DIR = `${PLUGIN_DIR}/includes/data/stories`;

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
    const pluginFilePath = `${PLUGIN_DIR}/${PLUGIN_FILE}`;
    const readmeFilePath = `${PLUGIN_DIR}/${README_FILE}`;

    const currentVersion = getCurrentVersionNumber(pluginFilePath);
    const newVersion = version || currentVersion;

    updateVersionNumbers(pluginFilePath, readmeFilePath, newVersion, nightly);
    const constantVersion = getCurrentVersionNumber(pluginFilePath, true);

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
    console.log('  $ commander.js build-plugin --zip');
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
  .action(({ composer, zip, clean }) => {
    const buildDirPath = `${PLUGIN_DIR}/${BUILD_DIR}`;

    // Make sure build directory exists and is empty.
    rmdirSync(BUILD_DIR, { recursive: true });
    mkdirSync(BUILD_DIR, { recursive: true });

    createBuild(PLUGIN_DIR, buildDirPath, composer);

    let build = BUILD_DIR;

    if (zip) {
      build = bundlePlugin(buildDirPath, composer, zip, clean);
    }

    console.log(
      `Plugin successfully built! Location: ${relative(process.cwd(), build)}`
    );
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

    const fontsFilePath = `${PLUGIN_DIR}/${FONTS_FILE}`;

    try {
      await buildFonts(fontsFilePath);
    } catch (err) {
      console.error('There was an error generating the web fonts list:', err);
      return;
    }

    console.log('Web fonts updated!');
  });

program
  .command('update-templates')
  .description('Update templates by running them through migration')
  .on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('  # Migrate templates to newest version');
    console.log('  $ commander.js update-templates');
  })
  .action(() => {
    updateTemplates(TEMPLATES_DIR);
    updateTemplates(STORIES_DIR);

    console.log("Templates updated! Don't forget to run prettier!");
  });

program.parse(process.argv);

/* eslint-enable no-console */
