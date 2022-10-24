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
import { storyPosterSize } from '../storyPosterSize';

describe('storyPosterSize', () => {
  it("should return true if the story's poster image has the wrong ratio", () => {
    const testFeaturedMedia = {
      height: 960,
      width: 960,
      url: 'featured-media.com/img',
    };
    const testHappy = storyPosterSize({
      url: 'featured-media.com/img',
      height: 960,
      width: 720,
    });
    const test = storyPosterSize(testFeaturedMedia);
    expect(testHappy).toBeFalse();
    expect(test).toBeTrue();
  });
  it('should return false for a story with the correct poster image size.', () => {
    const testFeaturedMedia = {
      height: 853,
      width: 640,
      url: 'featured-media.com/img',
    };

    const test = storyPosterSize(testFeaturedMedia);
    expect(test).toBeFalse();
  });
  it("should return true if the story's poster image is too small", () => {
    const testHeightFeaturedMedia = {
      url: 'featured-media.com/img',
      height: 1,
      width: 640,
    };
    const testWidthFeaturedMedia = {
      url: 'featured-media.com/img',
      width: 1,
      height: 853,
    };
    const testFeaturedMedia = {
      height: 1,
      width: 1,
      url: 'featured-media.com/img',
    };
    const testHappy = storyPosterSize({
      url: 'featured-media.com/img',
      height: 853,
      width: 640,
    });
    const testHeight = storyPosterSize(testHeightFeaturedMedia);
    const testWidth = storyPosterSize(testWidthFeaturedMedia);
    const test = storyPosterSize(testFeaturedMedia);
    expect(testHappy).toBeFalse();
    expect(testHeight).toBeTrue();
    expect(testWidth).toBeTrue();
    expect(test).toBeTrue();
  });
});
