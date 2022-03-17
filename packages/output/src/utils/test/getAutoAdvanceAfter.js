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
import { registerElementType } from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';

/**
 * Internal dependencies
 */
import getAutoAdvanceAfter from '../getAutoAdvanceAfter';

const id = 999;

describe('getAutoAdvanceAfter', () => {
  beforeAll(() => {
    elementTypes.forEach((element) => registerElementType(element));
  });

  it('should return the media element with the longest duration', () => {
    const elements = [
      { id: 123, type: 'video', resource: { length: 1 } },
      { id: 456, type: 'video', resource: { length: 10 } },
      { id: 789, type: 'video', resource: { length: 15 } },
    ];

    expect(
      getAutoAdvanceAfter({ id: 999, elements, defaultPageDuration: 7 })
    ).toBe('el-789-media');
  });

  it('should return default value', () => {
    expect(
      getAutoAdvanceAfter({ id: 999, elements: [], defaultPageDuration: 7 })
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
        },
      })
    ).toBe('page-999-background-audio');
  });

  it('should return not background audio length as not looping', () => {
    expect(
      getAutoAdvanceAfter({
        id,
        elements: [],
        defaultPageDuration: 7,
        backgroundAudio: {
          resource: { length: 15 },
          loop: true,
        },
      })
    ).toBe('7s');
  });

  it('should return not background audio length has elements', () => {
    const elements = [{ id: 456, type: 'video', resource: { length: 10 } }];
    const animations = [
      {
        id: '1',
        targets: ['456'],
        type: 'wild_wacky_animation',
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
        },
      })
    ).toBe('el-456-media');
  });

  it('should return background audio length with video elements', () => {
    const elements = [{ id: 456, type: 'video', resource: { length: 10 } }];
    const animations = [
      {
        id: '1',
        targets: ['456'],
        type: 'wild_wacky_animation',
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
        },
      })
    ).toBe('page-999-background-audio');
  });

  it('should return animation time', () => {
    const elements = [
      { id: '123', type: 'video', loop: true, resource: { length: 1 } },
      { id: '456', x: 0, y: 0, type: 'shape' },
    ];

    const animations = [
      {
        id: '1',
        targets: ['456'],
        duration: 10000,
        zoomFrom: 1,
        zoomTo: 2,
      },
      {
        id: '2',
        targets: ['123'],
        duration: 10000,
        zoomFrom: 2,
        zoomTo: 1,
      },
    ];

    const backgroundAudio = {
      resource: { length: 15 },
      loop: true,
    };
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
    const elements = [
      { id: '123', type: 'video', loop: false, resource: { length: 5 } },
      { id: '456', x: 0, y: 0, type: 'shape' },
    ];

    const animations = [
      {
        id: '1',
        targets: ['456'],
        duration: 10000,
        zoomFrom: 1,
        zoomTo: 2,
      },
      {
        id: '2',
        targets: ['123'],
        duration: 10000,
        zoomFrom: 2,
        zoomTo: 1,
      },
    ];

    const backgroundAudio = {
      resource: { length: 8 },
      loop: false,
    };
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
    const elements = [{ id: '456', x: 0, y: 0, type: 'shape' }];
    expect(
      getAutoAdvanceAfter({
        id,
        elements,
        backgroundAudio: {},
        animations: [],
      })
    ).toBe('7s');
  });
});
