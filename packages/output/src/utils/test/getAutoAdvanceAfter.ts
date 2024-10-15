/*
 * Copyright 2022 Google LLC
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
import type { StoryAnimation } from '@googleforcreators/animation';
import { AnimationType } from '@googleforcreators/animation';
import type {
  BackgroundAudio,
  Element,
  VideoElement,
  ShapeElement,
} from '@googleforcreators/elements';
import { ElementType, registerElementType } from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';

/**
 * Internal dependencies
 */
import getAutoAdvanceAfter from '../getAutoAdvanceAfter';

const id = '999';

describe('getAutoAdvanceAfter', () => {
  beforeAll(() => {
    // @ts-expect-error TODO: Fix types.
    elementTypes.forEach(registerElementType);
  });

  it('should return the media element with the longest duration', () => {
    const elements: Element[] = [
      {
        id: '123',
        type: 'video',
        resource: { length: 1, poster: 'https://example.com/poster.png' },
      } as unknown as VideoElement,
      {
        id: '456',
        type: 'video',
        resource: { length: 10, poster: 'https://example.com/poster.png' },
      } as unknown as VideoElement,
      {
        id: '789',
        type: 'video',
        resource: { length: 15, poster: 'https://example.com/poster.png' },
      } as unknown as VideoElement,
    ];

    expect(
      getAutoAdvanceAfter({ id: '999', elements, defaultPageDuration: 7 })
    ).toBe('el-789-media');
  });

  it('should return default value', () => {
    expect(
      getAutoAdvanceAfter({ id: '999', elements: [], defaultPageDuration: 7 })
    ).toBe('7s');
  });

  it('should return background audio length', () => {
    expect(
      getAutoAdvanceAfter({
        id,
        elements: [],
        backgroundAudio: {
          resource: { length: 15 },
          loop: false,
        } as unknown as BackgroundAudio,
      })
    ).toBe('page-999-background-audio');
  });

  it('should return not background audio length as not looping', () => {
    expect(
      getAutoAdvanceAfter({
        id,
        elements: [],
        backgroundAudio: {
          resource: { length: 15 },
          loop: true,
        } as unknown as BackgroundAudio,
      })
    ).toBe('7s');
  });

  it('should not return background audio if there are elements', () => {
    const elements: Element[] = [
      {
        id: 456,
        type: ElementType.Video,
        resource: { length: 10, poster: 'https://example.com/poster.png' },
      } as unknown as VideoElement,
    ];
    const animations: StoryAnimation[] = [
      {
        id: '1',
        targets: ['456'],
        type: AnimationType.Bounce,
        duration: 1000,
      },
    ];
    expect(
      getAutoAdvanceAfter({
        id,
        elements,
        animations,
        backgroundAudio: {
          resource: { length: 15 },
          loop: true,
        } as unknown as BackgroundAudio,
      })
    ).toBe('el-456-media');
  });

  it('should return background audio length with video elements', () => {
    const elements: Element[] = [
      {
        id: '456',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        rotationAngle: 0,
        type: ElementType.Video,
        resource: {
          type: 'video',
          mimeType: 'video/mp4',
          id: 123,
          src: 'https://example.com/video.mp4',
          poster: 'https://example.com/poster.png',
          alt: '',
          width: 100,
          height: 100,
          isExternal: false,
          length: 10,
          lengthFormatted: '0:10',
        },
        volume: 1,
        tracks: [],
      } as VideoElement,
    ];
    const animations: StoryAnimation[] = [
      {
        id: '1',
        targets: ['456'],
        type: AnimationType.Bounce,
        duration: 1000,
      },
    ];
    expect(
      getAutoAdvanceAfter({
        id,
        elements,
        animations,
        backgroundAudio: {
          resource: { length: 15 },
          loop: false,
        } as unknown as BackgroundAudio,
      })
    ).toBe('page-999-background-audio');
  });

  it('should return animation time', () => {
    const elements: Element[] = [
      {
        id: '123',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        rotationAngle: 0,
        type: ElementType.Video,
        loop: true,
        resource: {
          type: 'video',
          mimeType: 'video/mp4',
          id: 123,
          src: 'https://example.com/video.mp4',
          poster: 'https://example.com/poster.png',
          alt: '',
          width: 100,
          height: 100,
          isExternal: false,
          length: 10,
          lengthFormatted: '0:10',
        },
        volume: 1,
        tracks: [],
      } as VideoElement,
      { id: '456', x: 0, y: 0, type: 'shape' } as ShapeElement,
    ];

    const animations: StoryAnimation[] = [
      {
        id: '1',
        targets: ['456'],
        duration: 10000,
        zoomFrom: 1,
        zoomTo: 2,
        type: AnimationType.Zoom,
      },
      {
        id: '2',
        targets: ['123'],
        duration: 10000,
        zoomFrom: 2,
        zoomTo: 1,
        type: AnimationType.Zoom,
      },
    ];

    const backgroundAudio = {
      resource: { length: 15 },
      loop: true,
    } as unknown as BackgroundAudio;
    expect(
      getAutoAdvanceAfter({
        id,
        elements,
        backgroundAudio,
        animations,
      })
    ).toBe('10s');
  });

  it('should return animation time non-looping media', () => {
    const elements: Element[] = [
      {
        id: '123',
        type: 'video',
        poster: 'https://example.com/poster.png',
        loop: false,
        resource: { length: 5 },
      } as VideoElement,
      { id: '456', x: 0, y: 0, type: ElementType.Shape } as ShapeElement,
    ];

    const animations: StoryAnimation[] = [
      {
        id: '1',
        targets: ['456'],
        duration: 10000,
        zoomFrom: 1,
        zoomTo: 2,
        type: AnimationType.Zoom,
      },
      {
        id: '2',
        targets: ['123'],
        duration: 10000,
        zoomFrom: 2,
        zoomTo: 1,
        type: AnimationType.Zoom,
      },
    ];

    const backgroundAudio = {
      resource: { length: 8 },
      loop: false,
    } as unknown as BackgroundAudio;
    expect(
      getAutoAdvanceAfter({
        id,
        elements,
        backgroundAudio,
        animations,
      })
    ).toBe('10s');
  });

  it('should return default page duration', () => {
    const elements: Element[] = [
      { id: '456', x: 0, y: 0, type: 'shape' } as ShapeElement,
    ];
    expect(
      getAutoAdvanceAfter({
        id,
        elements,
        animations: [],
      })
    ).toBe('7s');
  });
});
