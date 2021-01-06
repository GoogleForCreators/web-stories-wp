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
import { getElementProperties } from '../useInsertElement';

const BASIC_SHAPE = {
  id: '8e06a649-ad1f-455d-a76b-ad012aff08ad',
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
  type: 'shape',
  x: 94,
  y: 77,
  width: 137,
  height: 137,
  scale: 100,
  focalX: 50,
  focalY: 50,
  mask: {
    type: 'triangle',
  },
};

describe('getElementProperties', () => {
  it('should keep x,y unmodified', () => {
    const inboundsX = 50;
    const inboundsY = 25;

    const result = getElementProperties(BASIC_SHAPE.type, {
      ...BASIC_SHAPE,
      x: inboundsX,
      y: inboundsY,
    });

    expect(result.x).toBe(inboundsX);
    expect(result.y).toBe(inboundsY);
  });
});
