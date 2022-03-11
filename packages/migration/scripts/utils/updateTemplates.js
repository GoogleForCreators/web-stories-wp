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

/**
 * External dependencies
 */
import { readdirSync, readFileSync, writeFileSync, lstatSync } from 'fs';
import { join, resolve } from 'path';

/**
 * Internal dependencies
 */
import { migrate, DATA_VERSION } from '../module.js';

function updateTemplates(templatesDir) {
  const fileNamePattern = /^.*\.json$/;

  const getFiles = (dir) =>
    readdirSync(dir).map((fileOrDir) =>
      lstatSync(join(dir, fileOrDir)).isDirectory()
        ? getFiles(join(dir, fileOrDir))
        : join(dir, fileOrDir)
    );

  // templatesDir is relative from the project root,
  // heence going two levels up.
  const templateFiles = getFiles(
    resolve(process.cwd(), '..', '..', templatesDir)
  )
    .flat()
    .filter((file) => fileNamePattern.test(file));

  for (const file of templateFiles) {
    const template = JSON.parse(readFileSync(file, 'utf8'));

    if (Number(template.version) === Number(DATA_VERSION)) {
      continue;
    }

    // This ensures that the version number is always at the top.
    const updatedTemplate = {
      version: DATA_VERSION,
      ...migrate(template, template.version),
    };
    updatedTemplate.version = DATA_VERSION;

    const templateFileContent = JSON.stringify(updatedTemplate);

    writeFileSync(file, templateFileContent);
  }
}

export default updateTemplates;
