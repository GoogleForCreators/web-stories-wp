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
import getFontDeclarations from '../getFontDeclarations';

describe('getFontDeclarations', () => {
  it('should ignore system fonts', () => {
    const pages = [
      {
        elements: [
          {
            type: 'text',
            font: {
              family: 'Arial',
              service: 'system',
            },
          },
          {
            type: 'text',
            font: {
              family: 'Helvetica',
              service: 'system',
            },
          },
        ],
      },
    ];

    expect(getFontDeclarations(pages)).toStrictEqual([]);
  });

  it('should return one item for multiple Google fonts', () => {
    const pages = [
      {
        elements: [
          {
            type: 'text',
            font: {
              family: 'Roboto',
              service: 'fonts.google.com',
            },
            fontStyle: 'italic',
          },
          {
            type: 'text',
            font: {
              family: 'Roboto',
              service: 'fonts.google.com',
            },
            fontStyle: 'italic',
          },
          {
            type: 'text',
            font: {
              family: 'Lato',
              service: 'fonts.google.com',
            },
            fontWeight: 400,
          },
          {
            type: 'text',
            font: {
              family: 'Lato',
              service: 'fonts.google.com',
            },
            fontWeight: 400,
          },
        ],
      },
    ];

    expect(getFontDeclarations(pages)).toHaveLength(1);
    expect(getFontDeclarations(pages)).toContain(
      'https://fonts.googleapis.com/css2?display=swap&family=Roboto%3Aital%401&family=Lato'
    );
  });

  it('should only include valid variants', () => {
    const pages = [
      {
        elements: [
          {
            type: 'text',
            font: {
              family: 'Architects Daughter',
              service: 'fonts.google.com',
              variants: [[0, 400]],
            },
            fontStyle: 'italic',
          },
        ],
      },
    ];

    expect(getFontDeclarations(pages)).toHaveLength(1);
    expect(getFontDeclarations(pages)).toContain(
      'https://fonts.googleapis.com/css2?display=swap&family=Architects+Daughter'
    );
  });
});
