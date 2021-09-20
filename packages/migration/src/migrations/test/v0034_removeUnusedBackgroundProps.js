/*
 * Copyright 2021 Google LLC
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
import removeUnusedBackgroundProps from '../v0034_removeUnusedBackgroundProps';

describe('removeUnusedBackgroundProps', () => {
  it('should remove overlay from pages', () => {
    expect(
      removeUnusedBackgroundProps({
        _test: 'story',
        pages: [
          {
            _test: 'page1',
            elements: [],
            overlay: 'solid',
          },
        ],
      })
    ).toStrictEqual({
      _test: 'story',
      pages: [
        {
          _test: 'page1',
          elements: [],
        },
      ],
    });
  });

  it('should not do anything in case of overlay not being set', () => {
    expect(
      removeUnusedBackgroundProps({
        _test: 'story',
        pages: [
          {
            _test: 'page1',
            elements: [],
          },
        ],
      })
    ).toStrictEqual({
      _test: 'story',
      pages: [
        {
          _test: 'page1',
          elements: [],
        },
      ],
    });
  });

  it('should remove backgroundColor from default background but not other elements', () => {
    expect(
      removeUnusedBackgroundProps({
        _test: 'story',
        pages: [
          {
            _test: 'page1',
            elements: [
              {
                type: 'shape',
                isDefaultBackground: true,
                backgroundColor: { r: 255, g: 255, b: 255 },
              },
              {
                type: 'shape',
                backgroundColor: { r: 0, g: 0, b: 0 },
              },
            ],
          },
        ],
      })
    ).toStrictEqual({
      _test: 'story',
      pages: [
        {
          _test: 'page1',
          elements: [
            {
              type: 'shape',
              isDefaultBackground: true,
            },
            {
              type: 'shape',
              backgroundColor: { r: 0, g: 0, b: 0 },
            },
          ],
        },
      ],
    });
  });
});
