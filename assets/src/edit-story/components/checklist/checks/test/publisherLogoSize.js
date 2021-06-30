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
import { publisherLogoSize } from '../publisherLogoSize';

describe('publisherLogoSize', () => {
  it("should return an error-type guidance message if the story's publisher logo is too small", () => {
    const testHeightStory = {
      id: 123,
      publisherLogo: {
        height: 1,
        width: 96,
      },
    };
    const testWidthStory = {
      id: 345,
      publisherLogo: {
        width: 1,
        height: 96,
      },
    };
    const testStory = {
      id: 456,
      publisherLogo: { height: 1, width: 1 },
    };
    const testHappy = publisherLogoSize({
      id: 345,
      publisherLogo: {
        height: 96,
        width: 96,
      },
    });
    const testHeight = publisherLogoSize(testHeightStory);
    const testWidth = publisherLogoSize(testWidthStory);
    const test = publisherLogoSize(testStory);
    expect(testHappy).toBe(false);
    expect(testHeight).toBe(true);
    expect(testWidth).toBe(true);
    expect(test).toBe(true);
  });
});
