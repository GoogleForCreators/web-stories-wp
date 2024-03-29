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
import {
  type Element,
  type TextElement,
  type VideoElement,
  type ImageElement,
  ElementType,
  registerElementType,
} from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';

/**
 * Internal dependencies
 */
import getLongestMediaElement from '../getLongestMediaElement';

describe('getLongestMediaElement', () => {
  beforeAll(() => {
    elementTypes.forEach(registerElementType);
  });

  it('should return the media element with the longest duration', () => {
    const elements: Element[] = [
      {
        type: ElementType.Video,
        resource: { length: 1, poster: 'https://example.com/poster.png' },
      } as unknown as VideoElement,
      {
        type: ElementType.Video,
        resource: { length: 10, poster: 'https://example.com/poster.png' },
      } as unknown as VideoElement,
      {
        type: ElementType.Video,
        resource: { length: 15, poster: 'https://example.com/poster.png' },
      } as unknown as VideoElement,
    ];

    expect(getLongestMediaElement(elements)).toStrictEqual({
      type: ElementType.Video,
      resource: { length: 15, poster: 'https://example.com/poster.png' },
    });
  });

  it('should ignore looping media', () => {
    const elements: Element[] = [
      {
        type: ElementType.Video,
        resource: { length: 1, poster: 'https://example.com/poster.png' },
      } as unknown as VideoElement,
      {
        type: ElementType.Video,
        resource: { length: 10, poster: 'https://example.com/poster.png' },
      } as unknown as VideoElement,
      {
        type: ElementType.Video,
        resource: { length: 15, poster: 'https://example.com/poster.png' },
        loop: true,
      } as unknown as VideoElement,
    ];

    expect(getLongestMediaElement(elements)).toStrictEqual({
      type: ElementType.Video,
      resource: { length: 10, poster: 'https://example.com/poster.png' },
    });
  });

  it('should ignore images', () => {
    const elements: Element[] = [{ type: 'image' } as unknown as ImageElement];

    expect(getLongestMediaElement(elements)).toBeUndefined();
  });

  it('should return undefined if there are no elements', () => {
    const elements: Element[] = [];

    expect(getLongestMediaElement(elements)).toBeUndefined();
  });

  it('should return undefined if there are no media elements', () => {
    const elements: Element[] = [
      { type: ElementType.Text } as unknown as TextElement,
      { type: ElementType.Text } as unknown as TextElement,
      { type: ElementType.Text } as unknown as TextElement,
    ];

    expect(getLongestMediaElement(elements)).toBeUndefined();
  });

  it('should return the media element with the longest duration if longer than minDuration', () => {
    const elements: Element[] = [
      {
        type: ElementType.Video,
        resource: { length: 1, poster: 'https://example.com/poster.png' },
      } as unknown as VideoElement,
      {
        type: ElementType.Video,
        resource: { length: 10, poster: 'https://example.com/poster.png' },
      } as unknown as VideoElement,
      {
        type: ElementType.Video,
        resource: { length: 15, poster: 'https://example.com/poster.png' },
      } as unknown as VideoElement,
    ];

    expect(getLongestMediaElement(elements, 13)).toStrictEqual({
      type: ElementType.Video,
      resource: { length: 15, poster: 'https://example.com/poster.png' },
    });
  });

  it('should return undefined if the longest duration is less than the minDuration', () => {
    const elements: Element[] = [
      {
        type: ElementType.Video,
        resource: { length: 1, poster: 'https://example.com/poster.png' },
      } as unknown as VideoElement,
      {
        type: ElementType.Video,
        resource: { length: 10, poster: 'https://example.com/poster.png' },
      } as unknown as VideoElement,
      {
        type: ElementType.Video,
        resource: { length: 15, poster: 'https://example.com/poster.png' },
      } as unknown as VideoElement,
    ];

    expect(getLongestMediaElement(elements, 16)).toBeUndefined();
  });
});
