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
import inlineTextProperties from '../v0017_inlineTextProperties';

function convert(content, properties) {
  const converted = inlineTextProperties({
    pages: [{ elements: [{ type: 'text', content, ...properties }] }],
  });
  return converted.pages[0].elements[0].content;
}

describe('inlineTextProperties', () => {
  describe('should parse all text elements', () => {
    it('should ignore non-text elements', () => {
      expect(
        inlineTextProperties({
          pages: [
            {
              elements: [
                {
                  type: 'square',
                  bold: true,
                },
                {
                  type: 'image',
                  content: 'Horse',
                  color: 'red',
                },
              ],
            },
          ],
        })
      ).toStrictEqual({
        pages: [
          {
            elements: [
              {
                type: 'square',
                bold: true,
              },
              {
                type: 'image',
                content: 'Horse',
                color: 'red',
              },
            ],
          },
        ],
      });
    });

    it('should parse multiple text elements on multiple pages', () => {
      expect(
        inlineTextProperties({
          pages: [
            {
              elements: [
                {
                  type: 'text',
                  bold: true,
                  content: 'Hello',
                },
                {
                  type: 'text',
                  textDecoration: 'underline',
                  content: 'Hello',
                },
              ],
            },
            {
              elements: [
                {
                  type: 'text',
                  fontStyle: 'italic',
                  content: 'Hello',
                },
                {
                  type: 'text',
                  fontWeight: 300,
                  content: 'Hello',
                },
              ],
            },
          ],
        })
      ).toStrictEqual({
        pages: [
          {
            elements: [
              {
                type: 'text',
                content: '<span style="font-weight: 700">Hello</span>',
              },
              {
                type: 'text',
                content:
                  '<span style="text-decoration: underline">Hello</span>',
              },
            ],
          },
          {
            elements: [
              {
                type: 'text',
                content: '<span style="font-style: italic">Hello</span>',
              },
              {
                type: 'text',
                content: '<span style="font-weight: 300">Hello</span>',
              },
            ],
          },
        ],
      });
    });

    it('should remove all deprecated properties', () => {
      const res = inlineTextProperties({
        pages: [
          {
            elements: [
              {
                type: 'text',
                bold: true,
                fontWeight: 300,
                fontStyle: 'italic',
                textDecoration: 'underline',
                letterSpacing: 5,
                color: { color: { r: 255, g: 0, b: 0 } },
                content: 'Hello',
              },
            ],
          },
        ],
      });

      const convertedElementKeys = res.pages[0].elements[0];
      expect(convertedElementKeys).toContainKey('content');
      expect(convertedElementKeys).not.toContainKeys([
        'bold',
        'fontWeight',
        'fontStyle',
        'textDecoration',
        'letterSpacing',
        'color',
      ]);
    });
  });

  it('should convert inline elements', () => {
    const original = `
      Lorem
      <strong>ipsum</strong>
      <em>dolor</em>
      <strong>sit</strong>
      amet,
      <em>
        consectetur
        <u>adipiscing</u>
        elit
      </em>.
    `;
    const converted = convert(original);
    const expected = `
      Lorem
      <span style="font-weight: 700">ipsum</span>
      <span style="font-style: italic">dolor</span>
      <span style="font-weight: 700">sit</span>
      amet,
      <span style="font-style: italic">
        consectetur
        <span style="text-decoration: underline">adipiscing</span>
        elit
      </span>.
    `;
    expect(converted).toStrictEqual(expected);
  });

  it('should convert nested elements', () => {
    const original = `
      <strong>Lorem
      <strong>ipsum</strong></strong>
      <em><em>dolor</em>
      <strong>sit</strong></em>
      amet,
      <u><em>
        consectetur
        <u>adipiscing</u>
        elit
      </em></u>.
    `;
    const converted = convert(original);
    const expected = `
      <span style="font-weight: 700">Lorem
      <span style="font-weight: 700">ipsum</span></span>
      <span style="font-style: italic"><span style="font-style: italic">dolor</span>
      <span style="font-weight: 700">sit</span></span>
      amet,
      <span style="text-decoration: underline"><span style="font-style: italic">
        consectetur
        <span style="text-decoration: underline">adipiscing</span>
        elit
      </span></span>.
    `;
    expect(converted).toStrictEqual(expected);
  });
  describe('should correctly interpret bold properties', () => {
    it('should correctly interpret bold property and ignore inline elements', () => {
      const original = 'Lorem <strong>ipsum</strong>';
      const properties = { bold: true };
      const converted = convert(original, properties);
      const expected = '<span style="font-weight: 700">Lorem ipsum</span>';
      expect(converted).toStrictEqual(expected);
    });

    it('should correctly interpret font weight property and ignore inline elements', () => {
      const original = 'Lorem <strong>ipsum</strong>';
      const properties = { fontWeight: 300 };
      const converted = convert(original, properties);
      const expected = '<span style="font-weight: 300">Lorem ipsum</span>';
      expect(converted).toStrictEqual(expected);
    });

    it('should ignore font weight set to 400', () => {
      const original = 'Lorem <strong>ipsum</strong>';
      const properties = { fontWeight: 400 };
      const converted = convert(original, properties);
      const expected = 'Lorem <span style="font-weight: 700">ipsum</span>';
      expect(converted).toStrictEqual(expected);
    });

    it('should use font weight over bold when both set if not 400', () => {
      const original = 'Lorem <strong>ipsum</strong>';
      const properties = { fontWeight: 300, bold: true };
      const converted = convert(original, properties);
      const expected = '<span style="font-weight: 300">Lorem ipsum</span>';
      expect(converted).toStrictEqual(expected);
    });

    it('should do nothing globally if font weight is 400 and bold is false', () => {
      const original = 'Lorem <strong>ipsum</strong>';
      const properties = { fontWeight: 400, bold: false };
      const converted = convert(original, properties);
      const expected = 'Lorem <span style="font-weight: 700">ipsum</span>';
      expect(converted).toStrictEqual(expected);
    });
  });

  describe('should correctly interpret italic property', () => {
    it('should correctly interpret font style property and ignore inline elements', () => {
      const original = 'Lorem <em>ipsum</em>';
      const properties = { fontStyle: 'italic' };
      const converted = convert(original, properties);
      const expected = '<span style="font-style: italic">Lorem ipsum</span>';
      expect(converted).toStrictEqual(expected);
    });

    it('should ignore font style set to anything but "italic"', () => {
      const original = 'Lorem <em>ipsum</em>';
      const properties = { fontStyle: 'oblique' };
      const converted = convert(original, properties);
      const expected = 'Lorem <span style="font-style: italic">ipsum</span>';
      expect(converted).toStrictEqual(expected);
    });
  });

  describe('should correctly interpret underline property', () => {
    it('should correctly interpret text decoration property and ignore inline elements', () => {
      const original = 'Lorem <u>ipsum</u>';
      const properties = { textDecoration: 'underline' };
      const converted = convert(original, properties);
      const expected =
        '<span style="text-decoration: underline">Lorem ipsum</span>';
      expect(converted).toStrictEqual(expected);
    });

    it('should ignore text decoration set to anything but "underline"', () => {
      const original = 'Lorem <u>ipsum</u>';
      const properties = { textDecoration: 'line-through' };
      const converted = convert(original, properties);
      const expected =
        'Lorem <span style="text-decoration: underline">ipsum</span>';
      expect(converted).toStrictEqual(expected);
    });
  });

  it('should correctly inline color property', () => {
    const original = 'Lorem ipsum';
    const properties = { color: { color: { r: 255, g: 0, b: 0, a: 0.5 } } };
    const converted = convert(original, properties);
    const expected =
      '<span style="color: rgba(255, 0, 0, 0.5)">Lorem ipsum</span>';
    expect(converted).toStrictEqual(expected);
  });

  it('should correctly inline letter spacing property', () => {
    const original = 'Lorem ipsum';
    const properties = { letterSpacing: 20 };
    const converted = convert(original, properties);
    const expected = '<span style="letter-spacing: 0.2em">Lorem ipsum</span>';
    expect(converted).toStrictEqual(expected);
  });

  it('should all work correctly together', () => {
    const original = `
      Lorem
      <strong>ipsum</strong>
      <em>dolor</em>
      <strong>sit</strong>
      amet,
      <em>consectetur
        <u>adipiscing</u>
        elit</em>.
    `;
    // Here we have global italic, color and letter spacing, but no global font weight or underline.
    const properties = {
      letterSpacing: 20,
      bold: false,
      fontWeight: 400,
      fontStyle: 'italic',
      color: { color: { r: 255, g: 0, b: 0 } },
      textDecoration: 'line-through',
    };
    const converted = convert(original, properties);
    const expected = `
      <span style="letter-spacing: 0.2em">
        <span style="color: rgba(255, 0, 0, 1)">
          <span style="font-style: italic">
            Lorem
            <span style="font-weight: 700">ipsum</span>
            dolor
            <span style="font-weight: 700">sit</span>
            amet,
            consectetur
            <span style="text-decoration: underline">adipiscing</span>
            elit.
          </span>
        </span>
      </span>
    `;
    expect(uniformWhitespace(converted)).toStrictEqual(
      uniformWhitespace(expected)
    );

    function uniformWhitespace(str) {
      return str
        .replace(/^|$/g, ' ') // insert single space front and back
        .replace(/></g, '> <') // and insert space between tags
        .replace(/\s+/g, ' '); // and then collapse all multi-whitespace to single space
    }
  });
});
