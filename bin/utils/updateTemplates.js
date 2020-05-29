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
import { readdirSync, readFileSync, writeFileSync } from 'fs';

/**
 * Internal dependencies
 */
import {
  migrate,
  DATA_VERSION,
} from '../../assets/src/edit-story/migration/migrate.js';

const TEMPLATE_CONTENT_REGEX = /return {[\s\S]*};/;
const SRC_REGEX = /"__TEMP_IMAGEBASEURL__([^"]*)"/g;

async function updateTemplates(templatesDir) {
  const fileNamePattern = /^.*\.js$/;
  const templateFiles = readdirSync(templatesDir).filter((file) =>
    fileNamePattern.test(file)
  );

  for (const file of templateFiles) {
    const { default: getTemplate } = await import(`${templatesDir}/${file}`);
    const template = getTemplate('__TEMP_IMAGEBASEURL__');

    const updatedTemplate = migrate(template, template.version);
    updatedTemplate.version = DATA_VERSION;

    let templateFileContent = readFileSync(`${templatesDir}/${file}`, 'utf8');
    templateFileContent = templateFileContent.replace(
      TEMPLATE_CONTENT_REGEX,
      () => {
        return 'return ' + JSON.stringify(updatedTemplate) + ';';
      }
    );

    templateFileContent = templateFileContent.replace(
      SRC_REGEX,
      (match, middle) => {
        return `\`\${imageBaseUrl}${middle}\``;
      }
    );

    writeFileSync(`${templatesDir}/${file}`, templateFileContent);
  }
}

export default updateTemplates;
