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
 * Internal dependencies
 */
import SYSTEM_FONTS from '../systemFonts';

jest.mock('fs');

jest.spyOn(process, 'cwd').mockReturnValue('');
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

// As downloaded from Google Fonts API.
const ABEZEE_FONT_BEFORE = {
  family: 'ABeeZee',
  variants: ['regular', 'italic'],
  category: 'sans-serif',
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
};

describe('Build Fonts', () => {
  const MOCK_FILE_INFO = {
    '/includes/data/fonts.json': JSON.stringify([ABEZEE_FONT_BEFORE]),
  };

  beforeEach(() => {
    require('fs').__setMockFiles(MOCK_FILE_INFO);
  });

  it('should combine system fonts with pre-existing list of Google Fonts', () => {
    const contentBefore = JSON.parse(
      require('fs').readFileSync('/includes/data/fonts.json')
    );

    require('../build-fonts.js');

    const contentAfter = JSON.parse(
      require('fs').readFileSync('/includes/data/fonts.json')
    );

    expect(contentAfter).toHaveLength(
      contentBefore.length + SYSTEM_FONTS.length
    );
    expect(contentAfter).toContainEqual(ABEZEE_FONT_AFTER);
    expect(mockExit).toHaveBeenCalledWith(0);
  });
});
