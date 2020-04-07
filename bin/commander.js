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

async function updateVersionNumbers(version, isPrerelease) {
  // Get the current commit hash. Used for pre-releases.
  const currentCommitHash = execSync('git rev-parse HEAD')
    .toString()
    .trim();

  let pluginFileContent = readFileSync(PLUGIN_FILE, 'utf8');
  const currentVersion = pluginFileContent.match(VERSION_REGEX)[1].trim();

  if (version) {
    pluginFileContent = pluginFileContent.replace(
      VERSION_REGEX,
      `* Version: ${version}`
    );
  }

  const newVersion =
    version ||
    (isPrerelease ? `${currentVersion}-${currentCommitHash}` : currentVersion);

  const versionConstant = pluginFileContent.match(VERSION_CONSTANT_REGEX);

  writeFileSync(
    PLUGIN_FILE,
    pluginFileContent.replace(
      versionConstant[0],
      `define( 'WEBSTORIES_VERSION', '${newVersion}' );`
    )
  );

  // Update Stable tag in readme.txt.
  const readmeContent = readFileSync(README_FILE, 'utf8');
  writeFileSync(
    README_FILE,
    readmeContent.replace(STABLE_TAG_REGEX, `Stable tag:        ${newVersion}`)
  );
}

async function buildPlugin(isPrerelease) {
  await updateVersionNumbers(isPrerelease);
}

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

async function bundlePlugin(copy) {
  const ignoredFiles = getIgnoredFiles();
  const excludeList = ignoredFiles
    .map((file) => `--exclude '${file}'`)
    .join(' ');

  const buildPath = 'build/web-stories';

  // Copy plugin folder to temporary location.
  execSync(`rsync -a ${excludeList} ${PLUGIN_DIR}/ ${buildPath}/`, {
    stdio: ['pipe', 'pipe', 'ignore'],
  });

  if (copy) {
    return;
  }

  // This ensures the folder in the final ZIP file is always named "web-stories".
  execSync(`zip -r web-stories.zip web-stories`, {
    cwd: PLUGIN_DIR + '/build',
    stdio: ['pipe', 'pipe', 'ignore'],
  });
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
  .option('-c, --copy', 'Only copy files without creating a ZIP file')
  .description('Bundle Web Stories plugin')
  .action(async ({ copy }) => {
    await bundlePlugin(copy);

    console.log('Plugin successfully bundled!');
  });

program.parse(process.argv);

/* eslint-enable no-console */
