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
  WELCOME_MESSAGE_SHORT,
  getBoilerplateName,
  getBoilerplateConfigList,
  scaffoldBoilerplateCustom,
  scaffoldBoilerplateWithCRA,
  log,
} from './common.js';
import {
  DEFAULT_PROJECT_NAME,
  BOILERPLATE_NAMES,
  SETUP_TYPES,
} from './constants.js';

program
  .option('-r, --registry', 'Custom npm registry to use')
  .option('-n, --name <name>', 'Project folder name', 'none')
  .option(
    '-t, --setupType <setup-type>',
    'Type of setup to use for scaffolding the project, pass 0 for CRA or 1 for custom setup',
    'none'
  )
  .option(
    '-b, --boilerplate <boilerplate>',
    'Which boilerplate to use',
    'none'
  );

program.parse(process.argv);

const options = program.opts();
const registry = options.registry;
const boilerplate = options.boilerplate;
let projectName = options.name;
let setupType = options.setupType;
let boilerplateName = getBoilerplateName(options.boilerplate, setupType);

const userPrompts = [];
const boilerplateDataList = getBoilerplateConfigList();
const foldersInCwd = fse.readdirSync(process.cwd());

// Prompt for project name if option does not have default value
if (projectName === 'none') {
  userPrompts.push({
    type: 'text',
    name: 'projectName',
    message: `Project Name (default : ${DEFAULT_PROJECT_NAME})`,
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
  log(
    'Invalid project name: Project name can only have small case characters and hyphen',
    'red'
  );
  process.exit(1);
}

// Prompt for setup type if option has default value.
if (setupType === 'none') {
  const choices = [
    {
      title: 'Create React App',
      value: SETUP_TYPES.CRA,
    },
    {
      title: 'Custom setup',
      value: SETUP_TYPES.CUSTOM,
    },
  ];

  userPrompts.push({
    type: 'select',
    name: 'setupType',
    message: 'Please select what kind for setup would you prefer:',
    choices,
  });
} else if (!Object.values(SETUP_TYPES).includes(setupType)) {
  // Validate, if value was passed as an argument.
  log(
    `Invalid setup type passed. Argument value should be either ${SETUP_TYPES.CRA} or ${SETUP_TYPES.CUSTOM}`,
    'red'
  );

  process.exit(1);
}

// Add prompt for what boilerplate to use if option has default value.
if (boilerplate === 'none') {
  const craChoices = boilerplateDataList
    .filter(({ type }) => type === SETUP_TYPES.CRA)
    .map(({ displayName, description, name }) => {
      return {
        title: displayName,
        description,
        value: name,
      };
    });

  const customChoices = boilerplateDataList
    .filter(({ type }) => type === SETUP_TYPES.CUSTOM)
    .map(({ displayName, description, name }) => {
      return {
        title: displayName,
        description,
        value: name,
      };
    });

  userPrompts.push({
    type: 'select',
    name: 'boilerplate',
    message: 'Boilerplate Type:',
    choices: (previousResponse) => {
      switch (previousResponse) {
        case SETUP_TYPES.CRA:
          return craChoices;
        case SETUP_TYPES.CUSTOM:
          return customChoices;
        default:
          return [];
      }
    },
  });
} else if (!Object.values(BOILERPLATE_NAMES).includes(boilerplate)) {
  const validBoilerplateNames = Object.values(BOILERPLATE_NAMES).join(', ');

  log(
    `Invalid boilerplate: boilerplate names can only be one of these - ${validBoilerplateNames}`,
    'red'
  );

  process.exit(1);
}

(async () => {
  const showPrompt = userPrompts.length > 0;

  log('\n\n');
  log(LOGO, 'cyan');
  log('\n\n');
  log(showPrompt ? WELCOME_MESSAGE : WELCOME_MESSAGE_SHORT, 'cyan');

  if (showPrompt) {
    const response = await prompts(userPrompts, {
      onCancel: () => {
        process.exit(1);
      },
    });

    projectName = response.projectName || DEFAULT_PROJECT_NAME;
    setupType = response.setupType;
    boilerplateName = response.boilerplate;
  }

  log('\n\n');
  log('Please wait, while we set things up....', 'green');

  switch (setupType) {
    case SETUP_TYPES.CRA:
      scaffoldBoilerplateWithCRA(boilerplateName, projectName, registry);
      break;
    case SETUP_TYPES.CUSTOM:
      scaffoldBoilerplateCustom(boilerplateName, projectName, registry);
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
