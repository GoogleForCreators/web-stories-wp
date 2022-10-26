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
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Internal dependencies
 */
import { CURATED_FONT_NAMES } from '../constants';
import type { Font } from '../types';

describe('Curated fonts', () => {
  const fonts: Font[] = JSON.parse(
    readFileSync(
      resolve(process.cwd(), 'packages/fonts/src/fonts.json'),
      'utf8'
    )
  ) as Font[];
  const fontNames = fonts.map(({ family }) => family);

  // @see https://github.com/googleforcreators/web-stories-wp/issues/3880
  it.each(CURATED_FONT_NAMES)(
    '%s font should exist in global fonts list',
    (fontName) => {
      expect(fontNames).toContain(fontName);
    }
  );
});
