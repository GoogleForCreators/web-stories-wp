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
 * Internal dependencies.
 */
import { PRIVATE_REGISTRY_URL, REACT_SUPPORTED_VERSION } from './constants.js';

const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );
const wavingHand = String.fromCodePoint( 0x1f44b );
const LOGO = fse.readFileSync( path.join( __dirname, 'text-art.txt' ) );
const WELCOME_MESSAGE = `Hi! ${ wavingHand } Welcome to Web stories. Let us help you try our story creation suite`;
const BOILERPLATE_DIR_PATH = `../boilerplate`;
const SHARED_DIR_PATH = '../shared';
const CONFIG_FILE = 'config.json';

/**
 * Get boilerplate data list.
 */
const getBoilerplateDataList = () => {
  const boilerplateDir = path.join( __dirname, BOILERPLATE_DIR_PATH );
  const boilerplateNames = fse.readdirSync( boilerplateDir );

  return boilerplateNames.map( ( name ) => {
    const metaPath = path.resolve(
      __dirname,
      BOILERPLATE_DIR_PATH,
      name,
      CONFIG_FILE,
    );

    return JSON.parse( fse.readFileSync( metaPath ) );
  } );
};

/**
 * Get boilerplate data.
 */
const getBoilerplateData = ( boilerplateIndex, boilerplateType ) => {
  return getBoilerplateDataList().filter(
    ( { type } ) => type === boilerplateType,
  )[ boilerplateIndex ];
};

/**
 * Install dependencies from meta.
 */
function installDependenciesFromMeta(
  boilerplateIndex,
  setupType,
  projectPath,
  isPrivate,
) {
  const meta = getBoilerplateDataList().filter(
    ( { type } ) => type === setupType,
  )[ boilerplateIndex ];

  if ( isPrivate ) {
    log( `\nUsing registry at url \`${ PRIVATE_REGISTRY_URL }\`\n` );
  }

  const { dependencies, devDependencies } = meta

  if ( dependencies ) {
    const dependencyInstallCommand =
      `npm ${ isPrivate ? `--registry ${ PRIVATE_REGISTRY_URL } ` : '' }i ` +
      dependencies.join( ' ' );

    execSync( dependencyInstallCommand, {
      cwd: projectPath,
    } );
  }

  if ( devDependencies ) {
    const devDependencyInstallCommand =
      `npm ${
        isPrivate ? `--registry ${ PRIVATE_REGISTRY_URL } ` : ''
      }i --save-dev` + devDependencies.join( ' ' );

    execSync( devDependencyInstallCommand, {
      cwd: projectPath,
    } );
  }
}

/**
 * Get boilerplate path.
 */
function getBoilerplatePath( boilerplateIndex, type ) {
  const boilerplateDir = path.join( __dirname, BOILERPLATE_DIR_PATH );
  const boilerplateDirNames = fse.readdirSync( boilerplateDir );

  let boilerplateDirName;

  if ( type === 'CRA' ) {
    const boilerplateDirNamesCra = boilerplateDirNames.filter( ( name ) => {
      const meta = JSON.parse(
        fse.readFileSync( path.resolve( boilerplateDir, name, CONFIG_FILE ) ),
      );

      return meta.type === 'CRA';
    } );

    boilerplateDirName = boilerplateDirNamesCra[ boilerplateIndex ];
  } else if ( type === 'custom' ) {
    const boilerplateDirNamesCustom = boilerplateDirNames.filter( ( name ) => {
      const meta = JSON.parse(
        fse.readFileSync( path.resolve( boilerplateDir, name, CONFIG_FILE ) ),
      );

      return meta.type === 'custom';
    } );

    boilerplateDirName = boilerplateDirNamesCustom[ boilerplateIndex ];
  }

  return path.join( boilerplateDir, boilerplateDirName );
}

/**
 * Scaffold boilerplate with CRA.
 */
function scaffoldBoilerplateWithCRA( boilerplateIndex, projectName, isPrivate ) {
  const boilerplatePath = getBoilerplatePath( boilerplateIndex, 'CRA' );
  const sharedPath = path.join( __dirname, SHARED_DIR_PATH );

  execSync( `npx create-react-app@latest ${ projectName }`, {
    cwd: process.cwd(),
  } );

  const projectPath = path.join( process.cwd(), projectName );

  replaceDir(
    path.resolve( boilerplatePath, 'src' ),
    path.resolve( projectPath, 'src' ),
  );

  replaceDir(
    path.resolve( boilerplatePath, 'public' ),
    path.resolve( projectPath, 'public' ),
  );

  const { replacements } = getBoilerplateData( boilerplateIndex, 'CRA' );

  replacements.forEach( ( { src, dest } ) => {
    fse.copySync( path.join( sharedPath, src ), path.join( projectPath, dest ) );
  } );

  // Install boilerplate dependencies listed in meta
  installDependenciesFromMeta( boilerplateIndex, 'CRA', projectPath, isPrivate );

  // Downgrade react and react-dom to supported version.
  execSync( `npm i react@${ REACT_SUPPORTED_VERSION } react-dom@${ REACT_SUPPORTED_VERSION }`, {
    cwd: projectPath,
  } );
}

/**
 * Scaffold custom boilerplate.
 */
function scaffoldBoilerplateCustom( boilerplateIndex, projectName, isPrivate ) {
  const projectPath = path.join( process.cwd(), projectName );
  const sharedPath = path.join( __dirname, SHARED_DIR_PATH );

  const boilerplatePath = path.join(
    getBoilerplatePath( boilerplateIndex, 'custom' ),
  );

  fse.copySync( boilerplatePath, projectPath );
  fse.removeSync( path.join( projectPath, CONFIG_FILE ) );

  // Get files from shared folder as per the mapping.
  const { replacements } = getBoilerplateData( boilerplateIndex, 'custom' );

  replacements.forEach( ( { src, dest } ) => {
    fse.copySync( path.join( sharedPath, src ), path.join( projectPath, dest ) );
  } );

  // Install main dependencies.
  execSync( 'npm i', {
    cwd: path.join( process.cwd(), projectName ),
  } );

  // Install boilerplate dependencies listed in meta.
  installDependenciesFromMeta(
    boilerplateIndex,
    'custom',
    projectPath,
    isPrivate,
  );
}

/**
 * Replace directory.
 */
function replaceDir( sourcePath, destinationPath ) {
  fse.removeSync( destinationPath );
  fse.copySync( path.join( sourcePath ), path.join( destinationPath ) );
}

/**
 * Utility function for logging.
 */
function log( text, color ) {
  console.log( color ? chalk[ color ]( text ) : text );
}

export {
  log,
  getBoilerplateDataList,
  replaceDir,
  scaffoldBoilerplateWithCRA,
  scaffoldBoilerplateCustom,
  WELCOME_MESSAGE,
  LOGO
};
