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
import getBoundRect from '../getBoundRect';

describe('getBoundRect', () => {
  it('should return correct outer frame values for 2 unrotated objects', () => {
    const elements = [
      {
        x: 10,
        y: 10,
        width: 100,
        height: 50,
      },
      {
        x: 30,
        y: 20,
        width: 100,
        height: 50,
      },
    ];

    const expectedResult = {
      startX: 10,
      startY: 10,
      endX: 130,
      endY: 70,
      width: 120,
      height: 60,
    };
    const boundRect = getBoundRect(elements);
    expect(boundRect).toStrictEqual(expectedResult);
  });

  it('should return correct outer frame values for 2+ unrotated objects', () => {
    const elements = [
      {
        x: 10,
        y: 10,
        width: 100,
        height: 50,
      },
      {
        x: 30,
        y: 20,
        width: 100,
        height: 50,
      },
      {
        x: 75,
        y: 84,
        width: 50,
        height: 32,
      },
    ];

    const expectedResult = {
      startX: 10,
      startY: 10,
      endX: 130,
      endY: 116,
      width: 120,
      height: 106,
    };
    const boundRect = getBoundRect(elements);
    expect(boundRect).toStrictEqual(expectedResult);
  });

  it('should return correct outer frame values for 2 rotated objects', () => {
    const elements = [
      {
        x: 10,
        y: 10,
        width: 100,
        height: 50,
        rotationAngle: 45,
      },
      {
        x: 30,
        y: 20,
        width: 100,
        height: 50,
        rotationAngle: 120,
      },
    ];

    const expectedResult = {
      startX: 7,
      startY: -18,
      endX: 127,
      endY: 101,
      width: 120,
      height: 119,
    };
    const boundRect = getBoundRect(elements);
    expect(boundRect).toStrictEqual(expectedResult);
  });

  it('should return correct outer frame values for 2+ rotated and unrotated objects', () => {
    const elements = [
      {
        x: 10,
        y: 10,
        width: 100,
        height: 50,
        rotationAngle: 45,
      },
      {
        x: 30,
        y: 20,
        width: 100,
        height: 50,
        rotationAngle: 120,
      },
      {
        x: 57,
        y: 83,
        width: 250,
        height: 12,
      },
      {
        x: 18,
        y: 5,
        width: 100,
        height: 100,
        rotationAngle: 90,
      },
    ];

    const expectedResult = {
      startX: 7,
      startY: -18,
      endX: 307,
      endY: 105,
      width: 300,
      height: 123,
    };
    const boundRect = getBoundRect(elements);
    expect(boundRect).toStrictEqual(expectedResult);
  });
});
