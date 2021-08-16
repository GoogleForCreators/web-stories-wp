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
import { imageElementMissingAlt } from '../imageElementMissingAlt';

describe('imageElementMissingAlt', () => {
  it('should return true if image element missing alt', () => {
    const element = {
      id: 'elementid',
      type: 'image',
      resource: {},
    };
    const test = imageElementMissingAlt(element);
    expect(test).toBe(true);
  });

  it('should return true if image element has empty alt', () => {
    const element = {
      id: 'elementid',
      type: 'image',
      alt: '',
      resource: {
        alt: '',
      },
    };
    const test = imageElementMissingAlt(element);
    expect(test).toBe(true);
  });

  it('should return false if image element has alt', () => {
    const element = {
      id: 'elementid',
      type: 'image',
      alt: 'Image is about things',
      resource: {},
    };
    expect(imageElementMissingAlt(element)).toBe(false);
  });

  it('should return false if image element has a resource alt', () => {
    const element = {
      id: 'elementid',
      type: 'image',
      resource: { alt: 'Image is about things' },
    };
    expect(imageElementMissingAlt(element)).toBe(false);
  });

  it(`should return false if it's not an image element`, () => {
    const element = {
      type: 'video',
      id: 'elementid',
      resource: { alt: '' },
    };
    expect(imageElementMissingAlt(element)).toBe(false);
  });
});
