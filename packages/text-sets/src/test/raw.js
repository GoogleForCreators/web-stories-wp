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

describe('Raw text set files', () => {
  const textSets = readdirSync(
    resolve(process.cwd(), 'packages/text-sets/src/raw')
  );

  describe.each(textSets)('%s text set', (textSet) => {
    const category = basename(textSet, '.json');
    const rawData = readFileSync(
      resolve(process.cwd(), `packages/text-sets/src/raw/${category}.json`),
      'utf8'
    );
    const data = JSON.parse(rawData);

    it('should contain at least two non-background elements', () => {
      for (const { elements } of data.pages) {
        // 3 since one is background element.
        expect(elements.length >= 3).toBeTrue();
      }
    });

    // eslint-disable-next-line jest/no-disabled-tests -- TODO(#10828): Replace Open Sans Condensed
    it.skip('should contain fonts from global fonts list', () => {
      const fonts = JSON.parse(
        readFileSync(
          resolve(process.cwd(), 'packages/fonts/src/fonts.json'),
          'utf8'
        )
      );
      const fontNames = fonts.map(({ family }) => family);

      for (const { elements } of data.pages) {
        for (const element of elements) {
          // eslint-disable-next-line jest/no-conditional-in-test
          if (!['text'].includes(element?.type)) {
            continue;
          }

          expect(fontNames).toContain(element.font.family);
        }
      }
    });
  });
});
