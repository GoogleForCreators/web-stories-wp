#!/usr/bin/env node

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

/* eslint-disable header/header -- above line should be on top*/

/**
 * External dependencies
 */
import { program } from 'commander';
import prompts from 'prompts';
import fse from 'fs-extra';

/**
 * Internal dependencies
 */
import {
  LOGO,
  WELCOME_MESSAGE,
  DEFAULT_PROJECT_NAME,
  getBoilerplateDataList,
  scaffoldBoilerplateCustom,
  scaffoldBoilerplatewithCRA,
  log,
} from './common.js';

program
  .option('-p, --private', 'install from local registry')
  .option('-n, --name <name>', 'project folder name', 'none')
  .option(
    '-t, --type <setup-type>',
    'type of setup to use for scaffolding the project, pass 0 for CRA or 1 for custom setup',
    'none'
  )
  .option(
    '-b, --boilerplate <boilerplate>',
    'which boilerplate to use',
    'none'
  );

program.parse(process.argv);

const isPrivate = program.opts().private;
let projectName = program.opts().name;
let setupType = program.opts().type;
let boilerplateIndex = program.opts().boilerplate;

const userPrompts = [];
const boilerplateDataList = getBoilerplateDataList();

const foldersInCwd = fse.readdirSync(process.cwd());

// Prompt for project name if option does not have default value
if (projectName === 'none') {
  userPrompts.push({
    type: 'text',
    name: 'projectName',
    message: 'Project Name (defaut : web-stories)',
    validate: (value) => {
      if (value.match(/[^a-z-]/g)) {
        return `Project name can only have small case characters and hyphen`;
      } else if (foldersInCwd.includes(value)) {
        return 'OOPS! Looks like you already have a directory with that name';
      }

      return true;
    },
  });
} else if (
  projectName.match(/[^a-z-]/g) ||
  foldersInCwd.includes(projectName)
) {
  // validator, if value was passed as an argument
  log(
    'Invalid project name: Project name can only have small case characters and hyphen',
    'red'
  );
  process.exit(1);
}

//add propmt for setup type if option has default value
if (setupType === 'none') {
  const choices = [
    {
      title: 'Create React App',
      value: 0,
    },
    {
      title: 'Custom setup',
      value: 1,
    },
  ];
  userPrompts.push({
    type: 'select',
    name: 'setupType',
    message: 'Please select what kind for setup would you prefer:',
    choices,
  });
} else {
  //validator, if value was passed as an argument
  if ([1, 2].includes(setupType)) {
    log(
      `Invalid setup type passed. Argument value should be either 1 or 2`,
      'red'
    );
    process.exit(1);
  }
}

//add propmt for what boilerplate to use if option has default value
if (boilerplateIndex === 'none') {
  const craChoices = boilerplateDataList
    .filter(({ type }) => type === 'CRA')
    .map(({ displayName, description }, ind) => {
      return {
        title: displayName,
        description,
        value: ind,
      };
    });
  const customChoices = boilerplateDataList
    .filter(({ type }) => type === 'custom')
    .map(({ displayName, description }, ind) => {
      return {
        title: displayName,
        description,
        value: ind,
      };
    });
  userPrompts.push({
    type: 'select',
    name: 'boilerplateIndex',
    message: 'Boilerplate Type:',
    choices: (prev) => (prev === 0 ? craChoices : customChoices),
  });
} else {
  //validator, if value was passed as an argument
  const numBoilerplateCra = boilerplateDataList.filter(
    ({ type }) => type === 'CRA'
  ).length;

  const numBoilerplateCustom = boilerplateDataList.filter(
    ({ type }) => type === 'custom'
  ).length;

  if (
    setupType === '0' &&
    (boilerplateIndex < 0 || boilerplateIndex > numBoilerplateCra)
  ) {
    log(
      `Invalid boilerplate: boilerplate should have a value between 0 and ${numBoilerplateCra.length})`,
      'red'
    );
    process.exit(1);
  }

  if (
    setupType === '1' &&
    (boilerplateIndex < 0 || boilerplateIndex > numBoilerplateCustom)
  ) {
    log(
      `Invalid Type: boilerplate should have a value between 0 and ${numBoilerplateCustom.length})`,
      'red'
    );
    process.exit(1);
  }
}

(async () => {
  log('\n\n');
  log(LOGO, 'cyan');
  log('\n\n');
  log(WELCOME_MESSAGE, 'cyan');
  let response;

  if (userPrompts) {
    response = await prompts(userPrompts, {
      onCancel: () => {
        process.exit(1);
      },
    });
    projectName = response.projectName || DEFAULT_PROJECT_NAME;
    setupType = response.setupType;
    boilerplateIndex = response.boilerplateIndex;
  }
  log('\n\n');
  log('Please wait, while we set things up....', 'green');

  switch (setupType) {
    case 0:
      scaffoldBoilerplatewithCRA(boilerplateIndex, projectName, isPrivate);
      break;

    case 1:
      scaffoldBoilerplateCustom(boilerplateIndex, projectName, isPrivate);
      break;

    default:
      break;
  }

  log('\n\n');
  log('Project created successfully!!', 'green');
  log('\n\n');
  log('Go into the project directory');
  log(`cd ${projectName}`, 'cyan');
  log('Run project in development mode.');
  log('npm start', 'cyan');
})();

/* eslint-enable header/header -- above line should be on top*/
