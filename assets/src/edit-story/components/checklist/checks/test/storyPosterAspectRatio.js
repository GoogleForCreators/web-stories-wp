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
import { storyPosterAspectRatio } from '../storyPosterAspectRatio';

describe('storyPosterAspectRatio', () => {
  it("should return true if the story's poster image has the wrong ratio", () => {
    const testStory = {
      id: 456,
      featuredMedia: { height: 960, width: 960, url: 'featured-media.com/img' },
    };
    const testHappy = storyPosterAspectRatio({
      id: 345,
      featuredMedia: {
        url: 'featured-media.com/img',
        height: 960,
        width: 720,
      },
    });
    const test = storyPosterAspectRatio(testStory);
    expect(testHappy).toBe(false);
    expect(test).toBe(true);
  });
  it('should return false for a story with the correct poster image size.', () => {
    const testStory = {
      id: 456,
      featuredMedia: { height: 853, width: 640, url: 'featured-media.com/img' },
    };

    const test = storyPosterAspectRatio(testStory);
    expect(test).toBe(false);
  });
});
