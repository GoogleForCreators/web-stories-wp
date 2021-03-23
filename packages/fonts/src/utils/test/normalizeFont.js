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
import normalizeFont from '../normalizeFont';

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

const ABHAYA_LIBRE_BEFORE = {
  family: 'Abhaya Libre',
  variants: ['regular', '500', '600', '700', '800'],
  category: 'serif',
};

const ABHAYA_LIBRE_AFTER = {
  family: 'Abhaya Libre',
  fallbacks: ['serif'],
  weights: [400, 500, 600, 700, 800],
  styles: ['regular'],
  variants: [
    [0, 400],
    [0, 500],
    [0, 600],
    [0, 700],
    [0, 800],
  ],
  service: 'fonts.google.com',
};

const ROBOTO_BEFORE = {
  family: 'Roboto',
  category: 'sans-serif',
  variants: [
    '100',
    '100italic',
    '300',
    '300italic',
    'regular',
    'italic',
    '500',
    '500italic',
    '700',
    '700italic',
    '900',
    '900italic',
  ],
};

const ROBOTO_AFTER = {
  family: 'Roboto',
  fallbacks: ['sans-serif'],
  weights: [100, 300, 400, 500, 700, 900],
  styles: ['italic', 'regular'],
  variants: [
    [0, 100],
    [1, 100],
    [0, 300],
    [1, 300],
    [0, 400],
    [1, 400],
    [0, 500],
    [1, 500],
    [0, 700],
    [1, 700],
    [0, 900],
    [1, 900],
  ],
  service: 'fonts.google.com',
};

describe('normalizeFont', () => {
  it('should normalize Google Fonts font objects', () => {
    expect(normalizeFont(ABEZEE_FONT_BEFORE)).toStrictEqual(ABEZEE_FONT_AFTER);
    expect(normalizeFont(ABHAYA_LIBRE_BEFORE)).toStrictEqual(
      ABHAYA_LIBRE_AFTER
    );
    expect(normalizeFont(ROBOTO_BEFORE)).toStrictEqual(ROBOTO_AFTER);
  });
});
