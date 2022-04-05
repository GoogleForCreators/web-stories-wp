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
 * External dependencies
 */
import { setUpEditorStore } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import getElementProperties from '../getElementProperties';

const COMMON_PROPERTIES = {
  opacity: 100,
  flip: {
    vertical: false,
    horizontal: false,
  },
  rotationAngle: 0,
  lockAspectRatio: true,
  backgroundColor: {
    color: {
      r: 196,
      g: 196,
      b: 196,
    },
  },
  x: 94,
  y: 77,
  width: 137,
  height: 137,
  scale: 100,
  focalX: 50,
  focalY: 50,
};

const BASIC_SHAPE = {
  ...COMMON_PROPERTIES,
  id: 'fake-shape-id',
  backgroundColor: {
    color: {
      r: 196,
      g: 196,
      b: 196,
    },
  },
  type: 'shape',
  mask: {
    type: 'triangle',
  },
};

const VIDEO_RESOURCE = {
  type: 'video',
  mimeType: 'video/webm',
  creationDate: '2021-05-11T21:55:24',
  src: 'http://test.example/video.mp4',
  width: 720,
  height: 1280,
  poster: 'http://test.example/video-poster.jpg',
  posterId: 92,
  id: 91,
  length: 6,
  lengthFormatted: '0:06',
  alt: 'small-video',
  sizes: {},
  isOptimized: false,
  baseColor: '#734727',
};

describe('getElementProperties', () => {
  beforeAll(() => {
    setUpEditorStore();
  });

  it('should default x/y to (48, 0) if not provided', () => {
    const properties = getElementProperties('shape', {
      ...BASIC_SHAPE,
      x: undefined,
      y: undefined,
    });

    expect(properties.x).toBe(48);
    expect(properties.y).toBe(0);
  });

  it('should keep x/y unmodified', () => {
    const properties = getElementProperties('shape', {
      ...BASIC_SHAPE,
      x: 50,
      y: 25,
    });

    expect(properties.x).toBe(50);
    expect(properties.y).toBe(25);
  });

  it('should keep resource unmodified', () => {
    const properties = getElementProperties('video', {
      ...COMMON_PROPERTIES,
      resource: VIDEO_RESOURCE,
    });

    expect(properties.resource).toStrictEqual(VIDEO_RESOURCE);
  });
});
