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
const { program } = require('commander');
const fse = require('fs-extra');
const path = require('path');
const execSync = require('child_process').execSync;

program
  .option('-p, --private', 'install from local registry')
  .option('-d, --directory <directory>', 'project folder name', 'web-stories');

program.parse(process.argv);

const isPrivate = program.opts().private;
const projectName = program.args[0] || 'web-stories' ;

const privateRegistryUrl = 'http://localhost:4873/';
const dependencies = [
  '@googleforcreators/story-editor',
  '@googleforcreators/dashboard',
  '@googleforcreators/elements',
  '@googleforcreators/element-library',
];

if (fse.existsSync(projectName)) {
  console.log('\n\n');
  console.log('\x1b[31m', 'A folder with same name already exists', '\x1b[0m');
  process.exit(1);
}
console.log('\n');
console.log('\x1b[32m','Setting up the Web Stories project..', '\x1b[0m');
console.log('\n');

fse.copySync(
  path.join(__dirname, '../boilerplate'),
  path.join(process.cwd(), projectName)
);
fse.copySync(
  path.join(__dirname, '../boilerplate/gitignore'),
  path.join(process.cwd(), projectName,'.gitignore')
);

const installCommand =
  `npm ${isPrivate ? `--registry ${privateRegistryUrl} ` : ''}i ` +
  dependencies.join(' ');

if (isPrivate) {
  console.log(`\nUsing registry at url \`${privateRegistryUrl}\`\n`);
}
execSync(installCommand, {
  cwd: path.join(process.cwd(), projectName),
  stdio: 'inherit',
});

execSync('npm i', {
  cwd: path.join(process.cwd(), projectName),
  stdio: 'inherit',
});

execSync('git init', {
  cwd: path.join(process.cwd(), projectName),
  stdio: 'inherit',
});

console.log('\n\n');
console.log('\x1b[36m', `cd ${ projectName }`, '\x1b[0m')
console.log('\x1b[36m', 'npm start', '\x1b[0m')
console.log('Run project in development mode.')

console.log('\n');

console.log('\x1b[36m', 'npm run start-prod', '\x1b[0m')
console.log('Run project in production mode.')

console.log('\n');

console.log('\x1b[36m', 'npm run build', '\x1b[0m')
console.log('Create a production build of the project.')
