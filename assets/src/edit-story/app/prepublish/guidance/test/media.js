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
import * as mediaGuidance from '../media';

describe('Pre-publish checklist - media guidelines (guidance)', () => {
  it('should return a message if a video element is less than 480p', () => {
    const tooLowResolutionVideoElement = {
      id: 789,
      type: 'video',
      resource: {
        sizes: {
          full: {
            height: 480,
            width: 852,
          },
        },
      },
    };

    const result = mediaGuidance.mediaElementResolution(
      tooLowResolutionVideoElement
    );
    expect(result).not.toBeUndefined();
    expect(result.message).toMatchInlineSnapshot(
      `"Increase video resolution to at least 480p"`
    );
    expect(result.type).toStrictEqual('guidance');
    expect(result.elementId).toStrictEqual(tooLowResolutionVideoElement.id);
  });

  it("should return a message if an image element's resolution is too low (<2x pixel density)", () => {
    const tooLowResolutionImageElement = {
      id: 910,
      type: 'image',
      height: 1000,
      width: 1000,
      resource: {
        sizes: {
          full: {
            height: 1000,
            width: 1000,
          },
        },
      },
    };

    const result = mediaGuidance.mediaElementResolution(
      tooLowResolutionImageElement
    );
    expect(result).not.toBeUndefined();
    expect(result.message).toMatchInlineSnapshot(
      `"Choose an image with higher resolution"`
    );
    expect(result.type).toStrictEqual('guidance');
    expect(result.elementId).toStrictEqual(tooLowResolutionImageElement.id);
  });

  it("should return a message if a gif element's resolution is too low (<2x pixel density)", () => {
    const tooLowResolutionImageElement = {
      id: 911,
      type: 'gif',
      height: 1000,
      width: 1000,
      resource: {
        output: {
          sizes: {
            mp4: {
              full: {
                height: 1000,
                width: 1000,
              },
            },
          },
        },
      },
    };

    const result = mediaGuidance.mediaElementResolution(
      tooLowResolutionImageElement
    );
    expect(result).not.toBeUndefined();
    expect(result.message).toMatchInlineSnapshot(
      `"Choose an image with higher resolution"`
    );
    expect(result.type).toStrictEqual('guidance');
    expect(result.elementId).toStrictEqual(tooLowResolutionImageElement.id);
  });

  it('should return a message if any video resolution is too high to display on most mobile devices (>4k)', () => {
    const tooHighVideoResolution = {
      id: 101,
      type: 'video',
      resource: {
        sizes: {
          full: {
            height: 2160,
            width: 3840,
          },
        },
      },
    };

    const result = mediaGuidance.mediaElementResolution(tooHighVideoResolution);
    expect(result).not.toBeUndefined();
    expect(result.message).toMatchInlineSnapshot(
      `"Reduce video resolution to less than 4000p"`
    );
    expect(result.type).toStrictEqual('guidance');
    expect(result.elementId).toStrictEqual(tooHighVideoResolution.id);
  });

  it('should return a message if the video element is longer than 1 minute', () => {
    const tooLongVideo = {
      id: 202,
      type: 'video',
      resource: {
        length: 75,
        sizes: {
          full: {
            height: 2160,
            width: 3840,
          },
        },
      },
    };

    const result = mediaGuidance.videoElementLength(tooLongVideo);
    expect(result).not.toBeUndefined();
    expect(result.message).toMatchInlineSnapshot(
      `"Split videos into segments of 1 minute or less"`
    );
    expect(result.type).toStrictEqual('guidance');
    expect(result.elementId).toStrictEqual(tooLongVideo.id);
  });

  it('should return a message if the video element is larger than 1080x1920 and not optimized', () => {
    const largeUnoptimizedVideo = {
      id: 202,
      type: 'video',
      resource: {
        isOptimized: false,
        height: 2160,
        width: 3840,
        local: false,
      },
    };

    const result = mediaGuidance.videoElementOptimized(largeUnoptimizedVideo);
    expect(result.message).toBe('Optimize video size');
    expect(result.type).toStrictEqual('guidance');
    expect(result.elementId).toStrictEqual(largeUnoptimizedVideo.id);
  });

  it('should not return a message if the video element is larger than 1080x1920 and Optimized', () => {
    const largeUnoptimizedVideo = {
      id: 202,
      type: 'video',
      resource: {
        isOptimized: true,
        height: 2160,
        width: 3840,
        local: false,
      },
    };

    const result = mediaGuidance.videoElementOptimized(largeUnoptimizedVideo);
    expect(result).toBeUndefined();
  });

  it('should not return a message if the video element is smaller than 1080x1920', () => {
    const smallUnoptimizedVideo = {
      id: 202,
      type: 'video',
      resource: {
        isOptimized: false,
        height: 300,
        width: 400,
        local: false,
      },
    };
    const smallOptimizedVideo = {
      id: 203,
      type: 'video',
      resource: {
        isOptimized: true,
        height: 300,
        width: 400,
        local: false,
      },
    };

    expect(
      mediaGuidance.videoElementOptimized(smallUnoptimizedVideo)
    ).toBeUndefined();
    expect(
      mediaGuidance.videoElementOptimized(smallOptimizedVideo)
    ).toBeUndefined();
  });

  it.todo('should return a message if the video element is less than 24fps');
});
