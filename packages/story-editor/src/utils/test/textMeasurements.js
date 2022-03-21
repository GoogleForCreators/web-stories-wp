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
import { calculateTextHeight } from '@googleforcreators/element-library';

describe('textMeasurements', () => {
  let element;

  beforeEach(() => {
    element = {
      id: '123',
      content: 'Content 1',
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
  });

  it('should create the measuring element', () => {
    calculateTextHeight(element, 100);
    const measurer = document.body['__WEB_STORIES_MEASURER__'];

    // Text is output as an element.
    expect(measurer.children).toHaveLength(1);
    expect(measurer.children[0].tagName).toBe('P');
    expect(measurer.children[0]).toHaveStyle({
      fontSize: '16px',
    });
    expect(measurer).toHaveTextContent('Content 1');

    // The "web-stories-content" class ensures that the editor markup and
    // text output do not conflict with each other. For instance,
    // `<b>` is styled with a regular `font-weight: bold`.
    expect(measurer).toHaveClass('web-stories-content');

    // The most important measurer styles.
    expect(measurer).toHaveStyle({
      boxSizing: 'border-box',
      position: 'fixed',
      zIndex: '-1',
      visibility: 'hidden',
    });
  });

  it('should re-render the measuring element', () => {
    calculateTextHeight(element, 100);
    const measurer = document.body['__WEB_STORIES_MEASURER__'];
    expect(measurer.children[0]).toHaveStyle({
      fontSize: '16px',
    });

    // Re-render.
    const element2 = { ...element, fontSize: 20, content: 'Content 2' };
    calculateTextHeight(element2, 100);

    // Text is output as an element.
    expect(measurer.children).toHaveLength(1);
    expect(measurer.children[0].tagName).toBe('P');
    expect(measurer.children[0]).toHaveStyle({
      fontSize: '20px',
    });
    expect(measurer).toHaveTextContent('Content 2');
  });
});
