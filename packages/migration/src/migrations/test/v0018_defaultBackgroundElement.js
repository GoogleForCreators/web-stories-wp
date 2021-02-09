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
import createDefaultBackgroundElement from '../v0018_defaultBackgroundElement';

describe('createDefaultBackgroundElement', () => {
  it('should remove background id', () => {
    const migrated = createDefaultBackgroundElement({
      pages: [
        {
          backgroundElementId: 'x',
          elements: [{ id: 'x' }],
        },
      ],
    });
    const page = migrated.pages[0];
    expect(page).not.toHaveProperty('backgroundElementId');
  });

  it('should mark existing background shapes as default background', () => {
    const migrated = createDefaultBackgroundElement({
      pages: [
        {
          elements: [
            {
              type: 'shape',
              isBackground: true,
            },
            {
              type: 'text',
            },
          ],
        },
      ],
    });
    const page = migrated.pages[0];
    const bgEl = page.elements[0];
    expect(bgEl).toStrictEqual({
      type: 'shape',
      isBackground: true,
      isDefaultBackground: true,
    });
  });

  it('should add default background element when non-shape is bg', () => {
    const migrated = createDefaultBackgroundElement({
      pages: [
        {
          elements: [
            {
              type: 'image',
              isBackground: true,
            },
            {
              type: 'text',
            },
          ],
        },
      ],
    });
    const page = migrated.pages[0];
    expect(page.defaultBackgroundElement).toStrictEqual(
      expect.objectContaining({
        type: 'shape',
        isBackground: true,
        isDefaultBackground: true,
      })
    );
  });
});
