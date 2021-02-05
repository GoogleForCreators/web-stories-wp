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
import defaultBackground from '../v0009_defaultBackground';

describe('defaultBackground', () => {
  it('should add a default background to pages that dont have it', () => {
    const migrated = defaultBackground({
      _test: 'story',
      pages: [
        {
          _test: 'page1',
          elements: [
            {
              _test: 'element1',
              type: 'text',
              padding: 10,
            },
            {
              _test: 'element2',
              type: 'text',
            },
          ],
        },
      ],
    });
    const page = migrated.pages[0];
    const bgEl = page.elements[0];
    expect(page.backgroundElementId).not.toBeNull();
    expect(page.backgroundElementId).toStrictEqual(bgEl.id);
    expect(bgEl.type).toStrictEqual('shape');
    expect(bgEl.isBackground).toStrictEqual(true);
  });

  it('should maintain background color when migrating', () => {
    const migrated = defaultBackground({
      _test: 'story',
      pages: [
        {
          _test: 'page1',
          backgroundColor: { color: { r: 255, g: 0, b: 0, a: 0.5 } },
          elements: [
            {
              _test: 'element1',
              type: 'text',
              padding: 10,
            },
            {
              _test: 'element2',
              type: 'text',
            },
          ],
        },
      ],
    });
    const page = migrated.pages[0];
    const bgEl = page.elements[0];
    expect(page.backgroundElementId).not.toBeNull();
    expect(page.backgroundElementId).toStrictEqual(bgEl.id);
    expect(bgEl.type).toStrictEqual('shape');
    expect(bgEl.isBackground).toStrictEqual(true);
    expect(bgEl.backgroundColor).toStrictEqual({
      color: { r: 255, g: 0, b: 0, a: 0.5 },
    });
  });

  it('should not add a background to elements that already have it', () => {
    expect(
      defaultBackground({
        _test: 'story',
        pages: [
          {
            _test: 'page1',
            backgroundElementId: 'unique-id',
            elements: [
              {
                _test: 'element1',
                type: 'image',
                isBackground: true,
                id: 'unique-id',
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
          backgroundElementId: 'unique-id',
          elements: [
            {
              _test: 'element1',
              type: 'image',
              isBackground: true,
              id: 'unique-id',
            },
          ],
        },
      ],
    });
  });
});
