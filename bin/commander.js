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

const { readFileSync, writeFileSync, existsSync, lstatSync } = require('fs');
const { execSync } = require('child_process');
const program = require('commander');

const VERSION_REGEX = /\* Version:(.+)/;
const VERSION_CONSTANT_REGEX = /define\(\s*'WEBSTORIES_VERSION',\s*'([^']*)'\s*\);/;
const STABLE_TAG_REGEX = /Stable tag:\s*(.+)/;

const PLUGIN_DIR = process.cwd();
const README_FILE = PLUGIN_DIR + '/readme.txt';
const PLUGIN_FILE = PLUGIN_DIR + '/web-stories.php';
const DISTIGNORE_FILE = PLUGIN_DIR + '/.distignore';

/**
 * Updates version numbers in plugin files.
 *
 * Namely, this updates the 'Version' header in the main plugin file,
 * the `WEBSTORIES_VERSION` constant in the same file, as well as the
 * stable tag in the readme.txt.
 *
 * If a specific version is provided, uses that version to update the constant.
 *
 * The stable tag is only updated if it's not a pre-release.
 *
 * @param {string} version Desired version number.
 * @param {boolean} isPrerelease Whether this is a pre-release.
 * @return {void} Nothing.
 */
function updateVersionNumbers(version = undefined, isPrerelease = false) {
  // Get the current commit hash. Used for pre-releases.
  const currentCommitHash = execSync('git rev-parse HEAD')
    .toString()
    .trim()
    .slice(0, 7);

  let pluginFileContent = readFileSync(PLUGIN_FILE, 'utf8');
  const currentVersion = pluginFileContent.match(VERSION_REGEX)[1].trim();

  isPrerelease = isPrerelease || currentVersion.includes('-');

  if (version) {
    // 'Version' plugin header must not include anything else beyond the version number,
    // i.e. no suffixes or similar.
    pluginFileContent = pluginFileContent.replace(
      VERSION_REGEX,
      `* Version: ${version}`
    );
  }

  const newVersion =
    version ||
    (isPrerelease ? `${currentVersion}+${currentCommitHash}` : currentVersion);

  const versionConstant = pluginFileContent.match(VERSION_CONSTANT_REGEX);

  writeFileSync(
    PLUGIN_FILE,
    pluginFileContent.replace(
      versionConstant[0],
      `define( 'WEBSTORIES_VERSION', '${newVersion}' );`
    )
  );

  // Update Stable tag in readme.txt.
  // If this is a pre-release, it's obviously not stable and shouldn't be added here.
  if (!isPrerelease) {
    const readmeContent = readFileSync(README_FILE, 'utf8');
    writeFileSync(
      README_FILE,
      readmeContent.replace(
        STABLE_TAG_REGEX,
        `Stable tag:        ${newVersion}`
      )
    );
  }
}

function buildPlugin(isPrerelease) {
  updateVersionNumbers(isPrerelease);
}

/**
 * Returns a list of files that should be ignored based on the .distignore file.
 *
 * @return {string[]} List of files.
 */
function getIgnoredFiles() {
  const maybeIgnoredFiles = readFileSync(DISTIGNORE_FILE, 'utf8').split('\n');
  const ignoredFiles = [];

  for (const file of maybeIgnoredFiles) {
    if (file.startsWith('#')) {
      continue;
    }

    if (file.trim() === '') {
      continue;
    }

    const fileFromRoot = PLUGIN_DIR + '/' + file;

    if (!existsSync(fileFromRoot)) {
      continue;
    }

    if (lstatSync(fileFromRoot).isDirectory()) {
      ignoredFiles.push(`${file}/`);
    } else {
      ignoredFiles.push(file);
    }
  }

  return ignoredFiles;
}

function createBuildDir() {
  const buildPath = 'build/web-stories';

  // Copy plugin folder to temporary location.
  execSync(`mkdir -p ${buildPath}`, {
    stdio: ['pipe', 'pipe', 'ignore'],
  });
}

function copyFiles(skipVendor) {
  const ignoredFiles = getIgnoredFiles();

  if (skipVendor) {
    ignoredFiles.push('vendor/');
  }

  const excludeList = ignoredFiles
    .map((file) => `--exclude '${file}'`)
    .join(' ');

  const buildPath = 'build/web-stories';

  // Copy plugin folder to temporary location.
  execSync(`rsync -a ${excludeList} ${PLUGIN_DIR}/ ${buildPath}/`, {
    stdio: ['pipe', 'pipe', 'ignore'],
  });
}

function deleteExistingZipFiles() {
  execSync(`rm -rf web-stories-*.zip`, {
    cwd: PLUGIN_DIR + '/build',
    stdio: ['pipe', 'pipe', 'ignore'],
  });
}

function deleteExistingBuildFolder() {
  execSync(`rm -rf web-stories`, {
    cwd: PLUGIN_DIR + '/build',
    stdio: ['pipe', 'pipe', 'ignore'],
  });
}

function generateZipFile(filename) {
  const pluginFileContent = readFileSync(PLUGIN_FILE, 'utf8');
  const currentVersion = pluginFileContent
    .match(VERSION_CONSTANT_REGEX)[1]
    .trim();

  const zipName = filename || `web-stories-${currentVersion}.zip`;

  // This ensures the folder in the final ZIP file is always named "web-stories".
  execSync(`zip -r ${zipName} web-stories`, {
    cwd: PLUGIN_DIR + '/build',
    stdio: ['pipe', 'pipe', 'ignore'],
  });
}

function bundlePlugin(target, copy, composer) {
  createBuildDir();

  if (!composer) {
    execSync(
      'composer update --no-dev --optimize-autoloader --no-interaction --prefer-dist --no-suggest'
    );
  }

  deleteExistingBuildFolder();
  copyFiles(composer);

  if (!composer) {
    execSync(
      'composer update --optimize-autoloader --no-interaction --prefer-dist --no-suggest; git checkout composer.lock; composer install'
    );
  }

  if (copy) {
    return;
  }

  deleteExistingZipFiles();
  generateZipFile(target);
}

program
  .command('build-plugin')
  .alias('build')
  .arguments('[version]')
  .option('-p, --prerelease', 'Whether this is a pre-release')
  .description('Build Web Stories plugin')
  .action(async (version, { prerelease }) => {
    await buildPlugin(version, prerelease);

    console.log('Plugin successfully built!');
  });

program
  .command('bundle-plugin')
  .alias('bundle')
  .arguments('[filename]')
  .option(
    '--copy',
    'Only copy files to build/ folder without creating a ZIP file'
  )
  .option('--composer', 'Create Composer-ready ZIP file without PHP autoloader')
  .description('Bundle Web Stories plugin as ZIP file')
  .action(async (filename, { copy, composer }) => {
    await bundlePlugin(filename, copy, composer);

    console.log('Plugin successfully bundled!');
  });

program.parse(process.argv);

/* eslint-enable no-console */
