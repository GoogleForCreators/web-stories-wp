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
import { registerElementTypes } from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';

/**
 * Internal dependencies
 */
import getLongestMediaElement from '../getLongestMediaElement';

describe('getLongestMediaElement', () => {
  beforeAll(() => {
    registerElementTypes(elementTypes);
  });

  it('should return the media element with the longest duration', () => {
    const elements = [
      { type: 'video', resource: { length: 1 } },
      { type: 'video', resource: { length: 10 } },
      { type: 'video', resource: { length: 15 } },
    ];

    expect(getLongestMediaElement(elements)).toStrictEqual({
      type: 'video',
      resource: { length: 15 },
    });
  });

  it('should ignore looping media', () => {
    const elements = [
      { type: 'video', resource: { length: 1 } },
      { type: 'video', resource: { length: 10 } },
      { type: 'video', resource: { length: 15 }, loop: true },
    ];

    expect(getLongestMediaElement(elements)).toStrictEqual({
      type: 'video',
      resource: { length: 10 },
    });
  });

  it('should ignore images', () => {
    const elements = [{ type: 'image' }];

    expect(getLongestMediaElement(elements)).toBeUndefined();
  });

  it('should return undefined if there are no elements', () => {
    const elements = [];

    expect(getLongestMediaElement(elements)).toBeUndefined();
  });

  it('should return undefined if there are no media elements', () => {
    const elements = [{ type: 'text' }, { type: 'text' }, { type: 'text' }];

    expect(getLongestMediaElement(elements)).toBeUndefined();
  });

  it('should return the media element with the longest duration if longer than minDuration', () => {
    const elements = [
      { type: 'video', resource: { length: 1 } },
      { type: 'video', resource: { length: 10 } },
      { type: 'video', resource: { length: 15 } },
    ];

    expect(getLongestMediaElement(elements, 13)).toStrictEqual({
      type: 'video',
      resource: { length: 15 },
    });
  });

  it('should return undefined if the longest duration is less than the minDuration', () => {
    const elements = [
      { type: 'video', resource: { length: 1 } },
      { type: 'video', resource: { length: 10 } },
      { type: 'video', resource: { length: 15 } },
    ];

    expect(getLongestMediaElement(elements, 16)).toBeUndefined();
  });
});
