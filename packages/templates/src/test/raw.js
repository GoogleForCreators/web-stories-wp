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
import { readdirSync, readFileSync } from 'fs';
import { resolve, basename } from 'path';

describe('Raw template files', () => {
  const templates = readdirSync(
    resolve(process.cwd(), 'packages/templates/src/raw')
  );

  // @see https://github.com/google/web-stories-wp/issues/2473#issuecomment-651509687
  it.each(templates)(
    '%s template should not contain invisible characters',
    (template) => {
      const templateContent = readFileSync(
        resolve(process.cwd(), `packages/templates/src/raw/${template}`),
        'utf8'
      );

      expect(templateContent).not.toContain('\u2028');
    }
  );

  // @see https://github.com/google/web-stories-wp/pull/4516
  // @see https://github.com/google/web-stories-wp/pull/6159
  it.each(templates)(
    '%s template should contain replaceable URLs',
    (template) => {
      const templateName = basename(template, '.json');
      const templateContent = readFileSync(
        resolve(process.cwd(), `packages/templates/src/raw/${template}`),
        'utf8'
      );
      const templateData = JSON.parse(templateContent);

      for (const { elements } of templateData.pages) {
        for (const element of elements) {
          if (element?.resource?.src) {
            expect(element?.resource?.src).toStartWith(
              `__WEB_STORIES_TEMPLATE_BASE_URL__/images/templates/${templateName}`
            );
          }
        }
      }
    }
  );

  // @see https://github.com/google/web-stories-wp/pull/5889
  it.each(templates)(
    '%s template should contain pageLayoutType',
    (template) => {
      const templateContent = readFileSync(
        resolve(process.cwd(), `packages/templates/src/raw/${template}`),
        'utf8'
      );
      const templateData = JSON.parse(templateContent);

      for (const page of templateData.pages) {
        expect(page).toStrictEqual(
          expect.objectContaining({
            pageLayoutType: expect.any(String),
          })
        );
      }
    }
  );
});
