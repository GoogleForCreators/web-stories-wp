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
import { getInUseFontsForPages, getTextSetsForFonts } from '../getInUseFonts';

describe('getInUseFontsForPages', () => {
  it('should return nothing for empty pages', () => {
    expect(getInUseFontsForPages([])).toStrictEqual([]);
  });

  it('should return a list of fonts for the pages', () => {
    expect(
      getInUseFontsForPages([
        {
          elements: [
            { type: 'text', font: { family: 'Roboto' } },
            { type: 'shape' },
            { type: 'text', font: { family: 'Google Sans' } },
          ],
        },
      ])
    ).toStrictEqual(['Roboto', 'Google Sans']);
  });

  it('should eliminate any duplicate fonts and list them only once', () => {
    expect(
      getInUseFontsForPages([
        {
          elements: [
            { type: 'text', font: { family: 'Roboto' } },
            { type: 'shape' },
            { type: 'text', font: { family: 'Roboto' } },
            { type: 'text', font: { family: 'Google Sans' } },
          ],
        },
      ])
    ).toStrictEqual(['Roboto', 'Google Sans']);
  });

  it('should eliminate any invalid data or missing font names', () => {
    expect(
      getInUseFontsForPages([
        {
          elements: [
            { type: 'shape' },
            { type: 'text', font: { family: null } },
            { type: 'text', font: { family: 'Google Sans' } },
          ],
        },
      ])
    ).toStrictEqual(['Google Sans']);
  });

  it('should return text sets for the fonts.', () => {
    expect(
      getTextSetsForFonts({
        fonts: ['Google Sans', 'Helvetica'],
        textSets: [
          { elements: [{ type: 'text', font: { family: 'Google Sans' } }] },
          { elements: [{ type: 'text', font: { family: 'Helvetica' } }] },
          { elements: [{ type: 'text', font: { family: 'Times New Roman' } }] },
        ],
      })
    ).toStrictEqual([
      { elements: [{ font: { family: 'Google Sans' }, type: 'text' }] },
      { elements: [{ font: { family: 'Helvetica' }, type: 'text' }] },
    ]);
  });

  it('should return an empty array if there are no matches.', () => {
    expect(
      getTextSetsForFonts({
        fonts: ['New York', 'San Francisco'],
        textSets: [
          { elements: [{ type: 'text', font: { family: 'Google Sans' } }] },
          { elements: [{ type: 'text', font: { family: 'Helvetica' } }] },
          { elements: [{ type: 'text', font: { family: 'Times New Roman' } }] },
        ],
      })
    ).toStrictEqual([]);
  });
});
