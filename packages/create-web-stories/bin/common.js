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
import { execSync } from 'child_process';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fse from 'fs-extra';
import chalk from 'chalk';

/**
 * Internal dependencies
 */
import { PRIVATE_REGISTRY_URL, REACT_SUPPORTED_VERSION } from './constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const wavingHand = String.fromCodePoint(0x1f44b);

const LOGO = fse.readFileSync(path.join(__dirname, 'text-art.txt'));
const WELCOME_MESSAGE_SHORT = `Hi! ${ wavingHand } Welcome to Web stories.`;
const WELCOME_MESSAGE = `Hi! ${wavingHand} Welcome to Web stories. Let us help you try our story creation suite`;
const BOILERPLATE_DIR_PATH = `../boilerplate`;
const SHARED_DIR_PATH = '../shared';
const CONFIG_FILE = 'config.json';

/**
 * Get boilerplate config.json data list.
 */
const getBoilerplateConfigList = () => {
  const boilerplateDir = path.join(__dirname, BOILERPLATE_DIR_PATH);
  const boilerplateDirNames = fse.readdirSync(boilerplateDir);

  return boilerplateDirNames.map((name) => {
    const configPath = path.join(
      __dirname,
      BOILERPLATE_DIR_PATH,
      name,
      CONFIG_FILE
    );

    return JSON.parse(fse.readFileSync(configPath));
  });
};

/**
 * Get boilerplate data.
 *
 * @param {string} boilerplateName Boilerplate name.
 */
const getBoilerplateConfig = (boilerplateName) => {
  return getBoilerplateConfigList().find(
    ({ name }) => name === boilerplateName
  );
};

/**
 * Install dependencies from configuration.
 *
 * @param {string} boilerplateName Boilerplate name.
 * @param {string} projectPath Project path.
 * @param {boolean} isPrivate Is private
 */
function installDependenciesFromConfig(
  boilerplateName,
  projectPath,
  isPrivate
) {
  const config = getBoilerplateConfig(boilerplateName);
  const { dependencies, devDependencies } = config;

  if (isPrivate) {
    log(`\nUsing registry at url \`${PRIVATE_REGISTRY_URL}\`\n`);
  }

  const registry = isPrivate ? `--registry ${PRIVATE_REGISTRY_URL} ` : '';

  if (dependencies && dependencies.length) {
    const command = `npm ${registry}i ` + dependencies.join(' ');
    execSync(command, {
      cwd: projectPath,
    });
  }

  if (devDependencies && devDependencies.length) {
    const command = `npm ${registry}i --save-dev` + devDependencies.join(' ');
    execSync(command, {
      cwd: projectPath,
    });
  }
}

/**
 * Get boilerplate path.
 *
 * @param {string} boilerplateName Boilerplate name.
 */
function getBoilerplatePath(boilerplateName) {
  const boilerplateDir = path.join(__dirname, BOILERPLATE_DIR_PATH);
  const boilerplateDirNames = fse.readdirSync(boilerplateDir);

  const boilerplateDirName = boilerplateDirNames.find((dirName) => {
    const configPath = path.join(boilerplateDir, dirName, CONFIG_FILE);
    const config = JSON.parse(fse.readFileSync(configPath));
    return config.name === boilerplateName;
  });

  return path.join(boilerplateDir, boilerplateDirName);
}

/**
 * Scaffold boilerplate with CRA.
 *
 * @param {string} boilerplateName Boilerplate name.
 * @param {string} projectName Project name.
 * @param {boolean} isPrivate Is private.
 */
function scaffoldBoilerplateWithCRA(boilerplateName, projectName, isPrivate) {
  const boilerplatePath = getBoilerplatePath(boilerplateName);
  const sharedPath = path.join(__dirname, SHARED_DIR_PATH);
  const projectPath = path.join(process.cwd(), projectName);

  execSync(`npx create-react-app@latest ${projectName}`, {
    cwd: process.cwd(),
  });

  replaceDir(
    path.resolve(boilerplatePath, 'src'),
    path.resolve(projectPath, 'src')
  );

  replaceDir(
    path.resolve(boilerplatePath, 'public'),
    path.resolve(projectPath, 'public')
  );

  const { replacements } = getBoilerplateConfig(boilerplateName);

  replacements.forEach(({ src, dest }) => {
    fse.copySync(path.join(sharedPath, src), path.join(projectPath, dest));
  });

  // Install boilerplate dependencies listed in meta
  installDependenciesFromConfig(boilerplateName, projectPath, isPrivate);

  // Downgrade react and react-dom to the supported version.
  execSync(
    `npm i react@${REACT_SUPPORTED_VERSION} react-dom@${REACT_SUPPORTED_VERSION}`,
    {
      cwd: projectPath,
    }
  );
}

/**
 * Scaffold custom boilerplate.
 *
 * @param {string} boilerplateName Boilerplate name.
 * @param {string} projectName Project name.
 * @param {boolean} isPrivate Is private.
 */
function scaffoldBoilerplateCustom(boilerplateName, projectName, isPrivate) {
  const projectPath = path.join(process.cwd(), projectName);
  const sharedPath = path.join(__dirname, SHARED_DIR_PATH);

  const boilerplatePath = getBoilerplatePath(boilerplateName);

  fse.copySync(boilerplatePath, projectPath);
  fse.removeSync(path.join(projectPath, CONFIG_FILE));

  // Get files from shared folder as per the mapping.
  const { replacements } = getBoilerplateConfig(boilerplateName);

  replacements.forEach(({ src, dest }) => {
    fse.copySync(path.join(sharedPath, src), path.join(projectPath, dest));
  });

  // Install main dependencies.
  execSync('npm i', {
    cwd: path.join(process.cwd(), projectName),
  });

  // Install boilerplate dependencies listed in meta.
  installDependenciesFromConfig(boilerplateName, projectPath, isPrivate);
}

/**
 * Replace directory.
 *
 * @param {string} sourcePath Source path.
 * @param {string} destinationPath Destination path.
 */
function replaceDir(sourcePath, destinationPath) {
  fse.removeSync(destinationPath);
  fse.copySync(path.join(sourcePath), path.join(destinationPath));
}

/**
 * Utility function for logging.
 *
 * @param {string} text Text to log.
 * @param {string} color Color supported by chalk.
 */
function log(text, color = '') {
  console.log(color ? chalk[color](text) : text);
}

/**
 * Get boilerplate directory name.
 *
 * @param {string} boilerplate Boilerplate.
 * @param {string} setupType Setup type
 */
function getBoilerplateName(boilerplate, setupType) {
  return boilerplate && setupType ? `${boilerplate}-${setupType}` : 'none';
}

export {
  log,
  replaceDir,
  getBoilerplateName,
  getBoilerplateConfigList,
  scaffoldBoilerplateCustom,
  scaffoldBoilerplateWithCRA,
  WELCOME_MESSAGE,
  WELCOME_MESSAGE_SHORT,
  LOGO,
};
