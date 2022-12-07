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
import getFontMetrics from '../getFontMetrics';

jest.mock('fs');
jest.mock('../getFontMetrics.js');

const ABEZEE_FONT_METRICS = {
  upm: 1,
  asc: 1,
  des: 1,
  tAsc: 1,
  tDes: 1,
  tLGap: 1,
  wAsc: 1,
  wDes: 1,
  xH: 1,
  capH: 1,
  yMin: 1,
  yMax: 1,
  hAsc: 1,
  hDes: 1,
  lGap: 1,
};

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
  metrics: ABEZEE_FONT_METRICS,
};

describe('buildFonts', () => {
  const MOCK_FILE_INFO = {
    '/assets/src/fonts/fonts.json': '{}',
  };

  beforeEach(() => {
    __setMockFiles(MOCK_FILE_INFO);
  });

  it('should combine system fonts with pre-existing list of Google Fonts', async () => {
    global.fetch.mockImplementationOnce(() => {
      return {
        ok: true,
        json: () =>
          Promise.resolve({
            items: [
              {
                family: 'ABeeZee',
                variants: ['regular', 'italic'],
                category: 'sans-serif',
                files: {
                  regular:
                    'http://fonts.gstatic.com/s/abeezee/v13/esDR31xSG-6AGleN6tKukbcHCpE.ttf',
                  italic:
                    'http://fonts.gstatic.com/s/abeezee/v13/esDT31xSG-6AGleN2tCklZUCGpG-GQ.ttf',
                },
              },
            ],
          }),
      };
    });

    getFontMetrics.mockImplementationOnce(() => ABEZEE_FONT_METRICS);

    await buildFonts('/assets/src/fonts/fonts.json');

    const contentAfter = JSON.parse(
      readFileSync('/assets/src/fonts/fonts.json')
    );
    expect(getFontMetrics).toHaveBeenCalledWith(
      'http://fonts.gstatic.com/s/abeezee/v13/esDR31xSG-6AGleN6tKukbcHCpE.ttf'
    );
    expect(contentAfter).toHaveLength(1 + SYSTEM_FONTS.length);
    expect(contentAfter).toContainEqual(ABEZEE_FONT_AFTER);
  });

  it('should bail on empty response', async () => {
    global.fetch.mockImplementationOnce(() => ({ body: '' }));

    await buildFonts('/assets/src/fonts/fonts.json');

    const contentAfter = readFileSync('/assets/src/fonts/fonts.json');
    expect(contentAfter).toBe('{}');
  });
});
