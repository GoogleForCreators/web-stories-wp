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
import type { Page, TextElement } from '@googleforcreators/elements';
import { ElementType, FontService } from '@googleforcreators/elements';
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import FontDeclarations from '../fontDeclarations';

describe('FontDeclarations', () => {
  it('should ignore system fonts', () => {
    const pages: Page[] = [
      {
        id: 'abc123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        elements: [
          {
            id: 'a',
            type: ElementType.Text,
            font: {
              family: 'Arial',
              service: FontService.System,
            },
            x: 100,
            y: 100,
            width: 200,
            height: 50,
            rotationAngle: 0,
          } as TextElement,
          {
            id: 'b',
            type: ElementType.Text,
            font: {
              family: 'Helvetica',
              service: FontService.System,
            },
            x: 100,
            y: 100,
            width: 200,
            height: 50,
            rotationAngle: 0,
          } as TextElement,
        ],
      },
    ];

    const { container } = render(<FontDeclarations pages={pages} />);
    expect(container).toMatchInlineSnapshot(`<div />`);
  });

  it('should return one item for multiple Google fonts', () => {
    const pages: Page[] = [
      {
        id: 'abc123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        elements: [
          {
            id: 'def456',
            x: 0,
            y: 0,
            width: 211,
            height: 221,
            rotationAngle: 1,
            type: ElementType.Text,
            font: {
              family: 'Roboto',
              service: FontService.GoogleFonts,
              variants: [
                [0, 400],
                [1, 400],
              ],
              fallbacks: ['Arial', 'sans-serif'],
            },
            content: '<span style="font-style: italic">Hello</span>',
            padding: {
              locked: false,
              vertical: 0,
              horizontal: 0,
            },
            marginOffset: 0,
            fontSize: 10,
            lineHeight: 1,
            textAlign: 'center',
            backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          } as TextElement,
          {
            id: 'abc123',
            x: 0,
            y: 0,
            width: 211,
            height: 221,
            rotationAngle: 1,
            type: ElementType.Text,
            font: {
              family: 'Roboto',
              service: FontService.GoogleFonts,
              variants: [
                [0, 400],
                [1, 400],
              ],
              fallbacks: ['Arial', 'sans-serif'],
            },
            content: '<span style="font-style: italic">Hello</span>',
            padding: {
              locked: false,
              vertical: 0,
              horizontal: 0,
            },
            marginOffset: 0,
            fontSize: 10,
            lineHeight: 1,
            textAlign: 'center',
            backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          } as TextElement,
          {
            id: 'xyz789',
            x: 0,
            y: 0,
            width: 211,
            height: 221,
            rotationAngle: 1,
            type: ElementType.Text,
            font: {
              family: 'Lato',
              service: FontService.GoogleFonts,
            },
          } as TextElement,
          {
            id: 'd',
            type: ElementType.Text,
            font: {
              family: 'Lato',
              service: 'fonts.google.com',
            },
            x: 100,
            y: 100,
            width: 200,
            height: 50,
            rotationAngle: 0,
          } as TextElement,
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
    const pages: Page[] = [
      {
        id: 'abc123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        elements: [
          {
            id: 'def456',
            x: 0,
            y: 0,
            width: 211,
            height: 221,
            rotationAngle: 1,
            type: ElementType.Text,
            font: {
              family: 'Architects Daughter',
              service: FontService.GoogleFonts,
              variants: [[0, 400]],
              fallbacks: ['sans-serif'],
            },
            content: '<span style="font-style: italic">Hello</span>',
            padding: {
              locked: false,
              vertical: 0,
              horizontal: 0,
            },
            marginOffset: 0,
            fontSize: 10,
            lineHeight: 1,
            textAlign: 'center',
            backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          } as TextElement,
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
    const pages: Page[] = [
      {
        id: 'abc123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        elements: [
          {
            id: 'a',
            type: ElementType.Text,
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
            x: 100,
            y: 100,
            width: 200,
            height: 50,
            rotationAngle: 0,
          } as unknown as TextElement,
          {
            id: 'b',
            type: ElementType.Text,
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
            x: 100,
            y: 100,
            width: 200,
            height: 50,
            rotationAngle: 0,
          } as unknown as TextElement,
          {
            id: 'c',
            type: ElementType.Text,
            font: {
              family: 'Molle',
              service: 'fonts.google.com',
              variants: [[1, 400]],
            },
            content: '<span style="font-weight: 400">Hello</span>',
            x: 100,
            y: 100,
            width: 200,
            height: 50,
            rotationAngle: 0,
          } as unknown as TextElement,
          {
            id: 'd',
            type: ElementType.Text,
            font: {
              family: 'Abel',
              service: 'fonts.google.com',
              variants: [[0, 400]],
            },
            content: '<span style="font-weight: 700">Hello</span>',
            x: 100,
            y: 100,
            width: 200,
            height: 50,
            rotationAngle: 0,
          } as unknown as TextElement,
          {
            id: 'e',
            type: ElementType.Text,
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
            x: 100,
            y: 100,
            width: 200,
            height: 50,
            rotationAngle: 0,
          } as unknown as TextElement,
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
    const pages: Page[] = [
      {
        id: 'abc123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        elements: [
          {
            id: 'a',
            type: ElementType.Text,
            font: {
              family: 'Roboto',
              service: 'fonts.google.com',
              variants: [
                [0, 400],
                [1, 400],
              ],
            },
            content: '<span style="font-style: italic">Hello</span>',
            x: 100,
            y: 100,
            width: 200,
            height: 50,
            rotationAngle: 0,
          } as unknown as TextElement,
          {
            id: 'b',
            type: ElementType.Text,
            font: {
              family: 'Roboto',
              service: 'fonts.google.com',
              variants: [
                [0, 400],
                [1, 400],
              ],
            },
            content: '<span style="font-style: italic">Hello</span>',
            x: 100,
            y: 100,
            width: 200,
            height: 50,
            rotationAngle: 0,
          } as unknown as TextElement,
          {
            id: 'c',
            type: ElementType.Text,
            font: {
              family: 'Lato',
              service: 'fonts.google.com',
            },
            x: 100,
            y: 100,
            width: 200,
            height: 50,
            rotationAngle: 0,
          } as unknown as TextElement,
          {
            id: 'd',
            type: ElementType.Text,
            font: {
              family: 'Lato',
              service: 'fonts.google.com',
            },
            x: 100,
            y: 100,
            width: 200,
            height: 50,
            rotationAngle: 0,
          } as unknown as TextElement,
          {
            id: 'e',
            type: ElementType.Text,
            font: {
              family: 'Vazir Regular',
              service: 'custom',
              url: 'https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/Vazir-Regular.ttf',
            },
            x: 100,
            y: 100,
            width: 200,
            height: 50,
            rotationAngle: 0,
          } as unknown as TextElement,
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
