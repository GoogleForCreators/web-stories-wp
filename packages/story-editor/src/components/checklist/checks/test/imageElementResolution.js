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
import { imageElementResolution } from '../imageElementResolution';

describe('imageElementResolution', () => {
  it("should return true if an image element's resolution is too low (<2x pixel density)", () => {
    const tooLowResolutionImageElement = {
      id: 910,
      type: 'image',
      height: 1000,
      width: 1000,
      resource: {
        height: 1000,
        width: 1000,
      },
    };

    const result = imageElementResolution(tooLowResolutionImageElement);
    expect(result).toBe(true);
  });

  it("should return true if a gif element's resolution is too low (<2x pixel density)", () => {
    const tooLowResolutionImageElement = {
      id: 911,
      type: 'gif',
      height: 1000,
      width: 1000,
      resource: {
        height: 1000,
        width: 1000,
      },
    };

    const result = imageElementResolution(tooLowResolutionImageElement);
    expect(result).toBe(true);
  });

  it("should return true if an image element's resolution is too low (<2x pixel density) accounting for scale", () => {
    const tooLowResolutionImageElement = {
      id: 910,
      type: 'image',
      height: 200,
      width: 200,
      scale: 400,
      resource: {
        height: 700,
        width: 700,
      },
    };

    const result = imageElementResolution(tooLowResolutionImageElement);
    expect(result).toBe(true);
  });
});
