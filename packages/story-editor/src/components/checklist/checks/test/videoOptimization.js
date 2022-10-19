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
import { videoElementsNotOptimized } from '../videoOptimization';

describe('videoOptimization (pre-publish checklist card)', () => {
  it('should return true if the video element is currently being transcoded', () => {
    const largeUnoptimizedVideo = {
      id: 202,
      type: 'video',
      resource: {
        isOptimized: false,
        height: 2160,
        width: 3840,
      },
    };

    const result = videoElementsNotOptimized(largeUnoptimizedVideo);
    expect(result).toBeTrue();
  });

  it('should return true if the video element is larger than 1080x1920 and not optimized', () => {
    const largeUnoptimizedVideo = {
      id: 202,
      type: 'video',
      resource: {
        isOptimized: false,
        height: 2160,
        width: 3840,
      },
    };

    const result = videoElementsNotOptimized(largeUnoptimizedVideo);
    expect(result).toBeTrue();
  });

  it('should return false if the video element is larger than 1080x1920 and is optimizing', () => {
    const largeUnoptimizedVideo = {
      id: 202,
      type: 'video',
      resource: {
        isOptimized: false,
        height: 2160,
        width: 3840,
      },
    };

    const result = videoElementsNotOptimized(largeUnoptimizedVideo);
    expect(result).toBeTrue();
  });

  it('should return false if the video element is larger than 1080x1920 and Optimized', () => {
    const largeUnoptimizedVideo = {
      id: 202,
      type: 'video',
      resource: {
        isOptimized: true,
        height: 2160,
        width: 3840,
      },
    };

    const result = videoElementsNotOptimized(largeUnoptimizedVideo);
    expect(result).toBeFalse();
  });

  it('should return false if the video element is larger than 1080x1920 and isExternal', () => {
    const largeUnoptimizedVideo = {
      id: 202,
      type: 'video',
      resource: {
        isExternal: true,
        isOptimized: true,
        height: 2160,
        width: 3840,
      },
    };

    const result = videoElementsNotOptimized(largeUnoptimizedVideo);
    expect(result).toBeFalse();
  });

  it('should return false if the video element is smaller than 1080x1920', () => {
    const smallUnoptimizedVideo = {
      id: 202,
      type: 'video',
      resource: {
        isOptimized: false,
        height: 300,
        width: 400,
      },
    };
    const smallOptimizedVideo = {
      id: 203,
      type: 'video',
      resource: {
        isOptimized: true,
        height: 300,
        width: 400,
      },
    };

    expect(videoElementsNotOptimized(smallUnoptimizedVideo)).toBeFalse();
    expect(videoElementsNotOptimized(smallOptimizedVideo)).toBeFalse();
  });

  it('should return false if the video element is exactly 1280x720', () => {
    const landscapeVideo = {
      id: 202,
      type: 'video',
      resource: {
        isOptimized: false,
        height: 720,
        width: 1280,
      },
    };
    const portraitVideo = {
      id: 202,
      type: 'video',
      resource: {
        isOptimized: false,
        height: 1280,
        width: 720,
      },
    };

    expect(videoElementsNotOptimized(landscapeVideo)).toBeFalse();
    expect(videoElementsNotOptimized(portraitVideo)).toBeFalse();
  });
});
