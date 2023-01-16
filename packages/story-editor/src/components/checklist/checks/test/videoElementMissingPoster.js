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
import { ELEMENT_TYPES } from '@googleforcreators/elements';
/**
 * Internal dependencies
 */
import { videoElementMissingPoster } from '../videoElementMissingPoster';

describe('videoElementMissingPoster', () => {
  it("should return true if the video element and resource don't have a poster image", () => {
    const posterlessVideo = {
      id: 303,
      type: ELEMENT_TYPES.VIDEO,
      resource: {
        height: 800,
        width: 500,
      },
    };

    const result = videoElementMissingPoster(posterlessVideo);
    expect(result).toBeTrue();
  });

  it('should not return true if the video resource has a poster image', () => {
    const posterlessVideo = {
      id: 303,
      type: ELEMENT_TYPES.VIDEO,
      resource: {
        height: 800,
        width: 500,
        poster: 'http://mydomain.com/test/poster',
      },
    };

    const result = videoElementMissingPoster(posterlessVideo);
    expect(result).toBeFalse();
  });

  it('should not return true if the video element has a poster image', () => {
    const posterlessVideo = {
      id: 303,
      type: ELEMENT_TYPES.VIDEO,
      resource: {
        height: 800,
        width: 500,
      },
      poster: 'http://mydomain.com/test/poster',
    };

    const result = videoElementMissingPoster(posterlessVideo);
    expect(result).toBeFalse();
  });
});
