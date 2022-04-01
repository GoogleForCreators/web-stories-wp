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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const privateRegistryUrl = 'http://localhost:4873/';

const DEFAULT_PROJECT_NAME = 'web-stories';

const getBoilerplateDataList = () => {
  const boilerplateDir = path.join(__dirname, '../boilerplates');
  const boilerplateNames = fse.readdirSync(boilerplateDir);

  return boilerplateNames.map((name) => {
    const metaPath = path.resolve(
      __dirname,
      '../boilerplates',
      name,
      'config.json'
    );
    return JSON.parse(fse.readFileSync(metaPath));
  });
};

const getBoilerplateData = (boilerplateIndex, boilerplateType) => {
  return getBoilerplateDataList().filter(
    ({ type }) => type === boilerplateType
  )[boilerplateIndex];
};

function installDependenciesFromMeta(
  boilerplateIndex,
  setupType,
  projectPath,
  isPrivate
) {
  const meta = getBoilerplateDataList().filter(
    ({ type }) => type === setupType
  )[boilerplateIndex];

  if (isPrivate) {
    log(`\nUsing registry at url \`${privateRegistryUrl}\`\n`);
  }

  const dependencies = meta.dependencies;
  const devDependencies = meta.devDependencies;

  if (dependencies) {
    const dependencyInstallCommand =
      `npm ${isPrivate ? `--registry ${privateRegistryUrl} ` : ''}i ` +
      dependencies.join(' ');

    execSync(dependencyInstallCommand, {
      cwd: projectPath,
    });
  }

  if (devDependencies) {
    const devDependencyInstallCommand =
      `npm ${
        isPrivate ? `--registry ${privateRegistryUrl} ` : ''
      }i --save-dev` + devDependencies.join(' ');

    execSync(devDependencyInstallCommand, {
      cwd: projectPath,
    });
  }
}

function getBoilerplatePath(boilerplateIndex, type) {
  const boilerplateDir = path.join(__dirname, '../boilerplates');
  const boilerplateDirNames = fse.readdirSync(boilerplateDir);

  let boilerplateDirName;

  if (type === 'CRA') {
    const boilerplateDirNamesCra = boilerplateDirNames.filter((name) => {
      const meta = JSON.parse(
        fse.readFileSync(path.resolve(boilerplateDir, name, 'config.json'))
      );
      return meta.type === 'CRA';
    });

    boilerplateDirName = boilerplateDirNamesCra[boilerplateIndex];
  } else if (type === 'custom') {
    const boilerplateDirNamesCustom = boilerplateDirNames.filter((name) => {
      const meta = JSON.parse(
        fse.readFileSync(path.resolve(boilerplateDir, name, 'config.json'))
      );
      return meta.type === 'custom';
    });

    boilerplateDirName = boilerplateDirNamesCustom[boilerplateIndex];
  }
  return path.join(boilerplateDir, boilerplateDirName);
}

function scaffoldBoilerplatewithCRA(boilerplateIndex, projectName, isPrivate) {
  const boilerplatePath = getBoilerplatePath(boilerplateIndex, 'CRA');
  const sharedPath = path.join(__dirname, '../shared');

  execSync(`npx create-react-app@latest ${projectName}`, {
    cwd: process.cwd(),
  });

  const projectPath = path.join(process.cwd(), projectName);
  //Replace files
  replaceDir(
    path.resolve(boilerplatePath, 'src'),
    path.resolve(projectPath, 'src')
  );

  replaceDir(
    path.resolve(boilerplatePath, 'public'),
    path.resolve(projectPath, 'public')
  );

  const { replacements } = getBoilerplateData(boilerplateIndex, 'CRA');

  replacements.forEach(({ src, dest }) => {
    fse.copySync(path.join(sharedPath, src), path.join(projectPath, dest));
  });

  //Install boilerplate dependencies listed in meta
  installDependenciesFromMeta(boilerplateIndex, 'CRA', projectPath, isPrivate);

  //downgrade react and react-dom to supported version
  execSync('npm i react@17.0.2 react-dom@17.0.2', {
    cwd: projectPath,
  });
}
function scaffoldBoilerplateCustom(boilerplateIndex, projectName, isPrivate) {
  const projectPath = path.join(process.cwd(), projectName);
  const sharedPath = path.join(__dirname, '../shared');

  //copy files
  const boilerplatePath = path.join(
    getBoilerplatePath(boilerplateIndex, 'custom')
  );

  fse.copySync(boilerplatePath, projectPath);
  fse.removeSync(path.join(projectPath, 'config.json'));

  //Get files from shared according to mapping
  const { replacements } = getBoilerplateData(boilerplateIndex, 'custom');

  replacements.forEach(({ src, dest }) => {
    fse.copySync(path.join(sharedPath, src), path.join(projectPath, dest));
  });

  //install main dependencies
  execSync('npm i', {
    cwd: path.join(process.cwd(), projectName),
  });

  //Install boilerplate dependencies listed in meta
  installDependenciesFromMeta(
    boilerplateIndex,
    'custom',
    projectPath,
    isPrivate
  );
}

function replaceDir(sourcePath, destinationPath) {
  fse.removeSync(destinationPath);
  fse.copySync(path.join(sourcePath), path.join(destinationPath));
}

function log(text, color) {
  console.log(color ? chalk[color](text) : text);
}

const LOGO = fse.readFileSync(path.join(__dirname, 'LOGO.txt'));
const wavingHand = String.fromCodePoint(0x1f44b);
const WELCOME_MESSAGE = `Hi! ${wavingHand} Welcome to Web stories. Let us help you try our story creation suite`;
export {
  log,
  privateRegistryUrl,
  getBoilerplateDataList,
  replaceDir,
  scaffoldBoilerplatewithCRA,
  scaffoldBoilerplateCustom,
  DEFAULT_PROJECT_NAME,
  LOGO,
  WELCOME_MESSAGE,
};
