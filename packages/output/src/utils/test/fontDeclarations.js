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
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import FontDeclarations from '../fontDeclarations';

describe('FontDeclarations', () => {
  it('should ignore system fonts', () => {
    const pages = [
      {
        id: 'abc123',
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

    const { container } = render(<FontDeclarations pages={pages} />);
    expect(container).toMatchInlineSnapshot(`<div />`);
  });

  it('should return one item for multiple Google fonts', () => {
    const pages = [
      {
        id: 'abc123',
        elements: [
          {
            type: 'text',
            font: {
              family: 'Roboto',
              service: 'fonts.google.com',
              variants: [
                [0, 400],
                [1, 400],
              ],
            },
            content: '<span style="font-style: italic">Hello</span>',
          },
          {
            type: 'text',
            font: {
              family: 'Roboto',
              service: 'fonts.google.com',
              variants: [
                [0, 400],
                [1, 400],
              ],
            },
            content: '<span style="font-style: italic">Hello</span>',
          },
          {
            type: 'text',
            font: {
              family: 'Lato',
              service: 'fonts.google.com',
            },
          },
          {
            type: 'text',
            font: {
              family: 'Lato',
              service: 'fonts.google.com',
            },
          },
        ],
      },
    ];

    const { container } = render(<FontDeclarations pages={pages} />);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <link
          href="https://fonts.googleapis.com/css2?display=swap&family=Roboto%3Aital%401&family=Lato"
          rel="stylesheet"
        />
      </div>
    `);
  });

  it('should only include valid variants', () => {
    const pages = [
      {
        id: 'abc123',
        elements: [
          {
            type: 'text',
            font: {
              family: 'Architects Daughter',
              service: 'fonts.google.com',
              variants: [[0, 400]],
            },
            content: '<span style="font-style: italic">Hello</span>',
          },
        ],
      },
    ];

    const { container } = render(<FontDeclarations pages={pages} />);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <link
          href="https://fonts.googleapis.com/css2?display=swap&family=Architects+Daughter"
          rel="stylesheet"
        />
      </div>
    `);
  });

  it('should fall back to closest variant', () => {
    const pages = [
      {
        id: 'abc123',
        elements: [
          {
            type: 'text',
            font: {
              family: 'Mukta Mahee',
              service: 'fonts.google.com',
              variants: [
                [0, 200],
                [0, 300],
                [0, 400],
                [0, 500],
                [0, 600],
                [0, 700],
                [0, 800],
              ],
            },
            content:
              '<span style="font-style: italic;font-weight: 200">Hello World</span>',
          },
          {
            type: 'text',
            font: {
              family: 'Mukta Mahee',
              service: 'fonts.google.com',
              variants: [
                [0, 200],
                [0, 300],
                [0, 400],
                [0, 500],
                [0, 600],
                [0, 700],
                [0, 800],
              ],
            },
            content:
              '<span style="font-style: italic;font-weight: 800">Hello</span>',
          },
          {
            type: 'text',
            font: {
              family: 'Molle',
              service: 'fonts.google.com',
              variants: [[1, 400]],
            },
            content: '<span style="font-weight: 400">Hello</span>',
          },
          {
            type: 'text',
            font: {
              family: 'Abel',
              service: 'fonts.google.com',
              variants: [[0, 400]],
            },
            content: '<span style="font-weight: 700">Hello</span>',
          },
          {
            type: 'text',
            font: {
              family: 'Alef',
              service: 'fonts.google.com',
              variants: [
                [0, 400],
                [0, 700],
              ],
            },
            content:
              '<span style="font-style: italic;font-weight: 600">Hello</span>',
          },
        ],
      },
    ];

    const { container } = render(<FontDeclarations pages={pages} />);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <link
          href="https://fonts.googleapis.com/css2?display=swap&family=Mukta+Mahee%3Awght%40200%3B800&family=Molle%3Aital%401&family=Abel&family=Alef%3Awght%40700"
          rel="stylesheet"
        />
      </div>
    `);
  });

  it('should add inline stylesheets for custom fonts', () => {
    const pages = [
      {
        id: 'abc123',
        elements: [
          {
            type: 'text',
            font: {
              family: 'Roboto',
              service: 'fonts.google.com',
              variants: [
                [0, 400],
                [1, 400],
              ],
            },
            content: '<span style="font-style: italic">Hello</span>',
          },
          {
            type: 'text',
            font: {
              family: 'Roboto',
              service: 'fonts.google.com',
              variants: [
                [0, 400],
                [1, 400],
              ],
            },
            content: '<span style="font-style: italic">Hello</span>',
          },
          {
            type: 'text',
            font: {
              family: 'Lato',
              service: 'fonts.google.com',
            },
          },
          {
            type: 'text',
            font: {
              family: 'Lato',
              service: 'fonts.google.com',
            },
          },
          {
            type: 'text',
            font: {
              family: 'Vazir Regular',
              service: 'custom',
              url: 'https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/Vazir-Regular.ttf',
            },
          },
        ],
      },
    ];

    const { container } = render(<FontDeclarations pages={pages} />);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <link
          href="https://fonts.googleapis.com/css2?display=swap&family=Roboto%3Aital%401&family=Lato"
          rel="stylesheet"
        />
        <style>
          @font-face {
          font-family: "Vazir Regular";
          src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/Vazir-Regular.ttf') format('truetype');
          font-weight: normal;
          font-display:swap;
        }
        </style>
      </div>
    `);
  });
});
