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
import { __setMockFiles, readFileSync } from 'fs';

/**
 * Internal dependencies
 */
import { SYSTEM_FONTS } from '../constants';
import buildFonts from '../buildFonts';
import fetch from '../fetch';

jest.mock('fs');
jest.mock('../fetch');

const ABEZEE_FONT_AFTER = {
  family: 'ABeeZee',
  fallbacks: ['sans-serif'],
  weights: [400],
  styles: ['regular', 'italic'],
  variants: [
    [0, 400],
    [1, 400],
  ],
  service: 'fonts.google.com',
};

describe('buildFonts', () => {
  const MOCK_FILE_INFO = {
    '/includes/data/fonts.json': '',
  };

  beforeEach(() => {
    __setMockFiles(MOCK_FILE_INFO);
  });

  it('should combine system fonts with pre-existing list of Google Fonts', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve(
        JSON.stringify({
          items: [
            {
              family: 'ABeeZee',
              variants: ['regular', 'italic'],
              category: 'sans-serif',
            },
          ],
        })
      )
    );

    await buildFonts('/includes/data/fonts.json');

    const contentAfter = JSON.parse(readFileSync('/includes/data/fonts.json'));
    expect(contentAfter).toHaveLength(1 + SYSTEM_FONTS.length);
    expect(contentAfter).toContainEqual(ABEZEE_FONT_AFTER);
  });

  it('should bail on empty response', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve(''));

    await buildFonts('/includes/data/fonts.json');

    const contentAfter = readFileSync('/includes/data/fonts.json');
    expect(contentAfter).toStrictEqual('');
  });
});
