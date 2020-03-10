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

describe('TextOutput', () => {
  it('should return HTML Output based on the params', () => {
    const element = {
      id: '123',
      content: 'Content',
      color: {
        color: {
          r: 255,
          g: 255,
          b: 255,
          a: 0.5,
        },
      },
      backgroundColor: {
        color: {
          r: 255,
          g: 0,
          b: 0,
          a: 0.3,
        },
      },
      fontSize: 16,
      letterSpacing: 1.3,
      textAlign: 'left',
      textDecoration: 'none',
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
    };

    const output = renderToStaticMarkup(<TextOutput element={element} />);
    expect(output).toStrictEqual(
      '<p class="fill" style="font-size:0.83333%;letter-spacing:1.3em;padding:0% 0%;text-align:left;text-decoration:none;white-space:pre-wrap;background-color:rgba(255,0,0,0.3);color:rgba(255,255,255,0.5)">Content</p>'
    );
  });
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
      },
      box: { width: 1080, height: 1920, x: 50, y: 100, rotationAngle: 0 },
    };

    await expect(<TextOutput {...props} />).toBeValidAMPStoryElement();
  });
});
