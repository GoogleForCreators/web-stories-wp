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
import calculateImageSelectOptions from '../calculateImageSelectOptions';

const attachment = {
  get: () => {
    return 300;
  },
};

describe('calculateImageSelectOptions', () => {
  it('pass some default values', () => {
    const controller = {
      get: () => {
        return {
          mustBeCropped: () => {},
          params: {
            flex_width: 0,
            flex_height: 0,
            width: 300,
            height: 300,
          },
        };
      },
      set: () => {},
    };
    const result = calculateImageSelectOptions(attachment, controller);
    const expectedCalculateImageSelectOptions = {
      aspectRatio: '300:300',
      handles: true,
      imageHeight: 300,
      imageWidth: 300,
      instance: true,
      keys: true,
      minHeight: 300,
      minWidth: 300,
      persistent: true,
      x1: 0,
      x2: 300,
      y1: 0,
      y2: 300,
    };
    expect(result).toStrictEqual(expectedCalculateImageSelectOptions);
  });

  it('flex height and widget', () => {
    const controller = {
      get: () => {
        return {
          mustBeCropped: () => {},
          params: {
            flex_width: 1,
            flex_height: 1,
            width: 300,
            height: 300,
          },
        };
      },
      set: () => {},
    };
    const result = calculateImageSelectOptions(attachment, controller);
    const expectedCalculateImageSelectOptions = {
      handles: true,
      imageHeight: 300,
      imageWidth: 300,
      instance: true,
      keys: true,
      maxHeight: 300,
      maxWidth: 300,
      persistent: true,
      x1: 0,
      x2: 300,
      y1: 0,
      y2: 300,
    };
    expect(result).toStrictEqual(expectedCalculateImageSelectOptions);
  });
});
