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
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * Internal dependencies
 */
import TextOutput from '../output';

function renderViaString(...args) {
  // Render an element via string to test that Output templates do not use
  // forbidden dependencies.
  const html = renderToStaticMarkup(...args);
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.firstElementChild;
}

describe('TextOutput', () => {
  it('should return HTML Output based on the params', () => {
    const element = {
      id: '123',
      content: 'Content',
      backgroundColor: {
        color: {
          r: 255,
          g: 0,
          b: 0,
          a: 0.3,
        },
      },
      font: {
        family: 'Roboto',
        metrics: {
          upm: 2048,
          asc: 1900,
          des: -500,
          tAsc: 1536,
          tDes: -512,
          tLGap: 102,
          wAsc: 1946,
          wDes: 512,
          xH: 1082,
          capH: 1456,
          yMin: -555,
          yMax: 2163,
          hAsc: 1900,
          hDes: -500,
          lGap: 0,
        },
      },
      fontSize: 16,
      textAlign: 'left',
      type: 'text',
      x: 10,
      y: 10,
      width: 50,
      height: 50,
      rotationAngle: 0,
      padding: {
        vertical: 0,
        horizontal: 0,
      },
      box: { width: 1080 },
    };

    const output = renderViaString(
      <TextOutput
        element={element}
        box={{ width: 1080, height: 1920, x: 50, y: 100, rotationAngle: 0 }}
      />
    );
    expect(output.tagName).toBe('P');
    expect(output.innerHTML).toBe('Content');
    expect(output).toHaveClass('fill', { exact: true });
    expect(output.style).toMatchObject({
      whiteSpace: 'pre-wrap',
      padding: '0% 0%',
      fontSize: '0.258900em',
      textAlign: 'left',
    });
  });

  it('should convert padding to percent of width', () => {
    const element = {
      id: '123',
      content: 'Content',
      font: {
        family: 'Roboto',
      },
      fontSize: 16,
      textAlign: 'left',
      type: 'text',
      x: 10,
      y: 10,
      width: 50,
      height: 100,
      rotationAngle: 0,
      padding: {
        vertical: 10,
        horizontal: 10,
      },
    };

    const output = renderViaString(
      <TextOutput
        element={element}
        box={{ width: 1080, height: 1920, x: 50, y: 100, rotationAngle: 0 }}
      />
    );
    expect(output.tagName).toBe('P');
    expect(output.innerHTML).toBe('Content');
    expect(output).toHaveClass('fill', { exact: true });
    expect(output.style).toMatchObject({
      padding: '20% 20%',
    });
  });

  it('should wrap font-family into quotes', () => {
    const element = {
      id: '123',
      content: 'Content',
      type: 'text',
      x: 10,
      y: 10,
      width: 50,
      height: 50,
      font: {
        family: 'Baloo Bhaina 2',
      },
      fontSize: 16,
      rotationAngle: 0,
      padding: {
        vertical: 0,
        horizontal: 0,
      },
    };

    const output = renderViaString(
      <TextOutput
        element={element}
        box={{ width: 50, height: 50, x: 10, y: 10, rotationAngle: 0 }}
      />
    );
    expect(output).toHaveStyle({
      fontFamily: '"Baloo Bhaina 2"',
    });
  });

  it('should display correct font fallback', () => {
    const element = {
      id: '123',
      content: 'Content',
      type: 'text',
      x: 10,
      y: 10,
      width: 50,
      height: 50,
      font: {
        family: 'Baloo Bhaina 2',
        fallbacks: ['Roboto', 'cursive'],
      },
      fontSize: 16,
      rotationAngle: 0,
      padding: {
        vertical: 0,
        horizontal: 0,
      },
    };

    const output = renderViaString(
      <TextOutput
        element={element}
        box={{ width: 50, height: 50, x: 10, y: 10, rotationAngle: 0 }}
      />
    );
    expect(output).toHaveStyle({
      fontFamily: '"Baloo Bhaina 2","Roboto",cursive',
    });
  });
  it('should not have overflow: hidden style applied', () => {
    const props = {
      element: {
        type: 'text',
        id: '123',
        x: 50,
        y: 100,
        height: 1920,
        width: 1080,
        rotationAngle: 0,
        content: 'Look Mom! No hands!',
        color: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
        padding: {
          horizontal: 0,
          vertical: 0,
        },
        font: {
          family: 'Roboto',
        },
      },
      box: { width: 1080, height: 1920, x: 50, y: 100, rotationAngle: 0 },
    };

    const output = renderViaString(<TextOutput {...props} />);
    expect(output).not.toHaveStyle({
      overflow: 'hidden',
    });
  });

  describe('AMP validation', () => {
    it('should produce valid AMP output', async () => {
      const props = {
        element: {
          type: 'text',
          id: '123',
          x: 50,
          y: 100,
          height: 1920,
          width: 1080,
          rotationAngle: 0,
          content: 'Hello World',
          color: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
          padding: {
            horizontal: 0,
            vertical: 0,
          },
          font: {
            family: 'Roboto',
          },
        },
        box: { width: 1080, height: 1920, x: 50, y: 100, rotationAngle: 0 },
      };

      await expect(<TextOutput {...props} />).toBeValidAMPStoryElement();
    });
  });
});
