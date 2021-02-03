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
import { PAGE_HEIGHT, PAGE_WIDTH } from '../../../../constants';
import * as mediaGuidance from '../media';

describe('Pre-publish checklist - media guidelines (guidance)', () => {
  it('should return a message if an image element takes up <50% of the safe zone area', () => {
    const tooSmallImageElement = {
      id: 123,
      type: 'image',
      height: 50,
      width: 50,
      x: 0,
      y: 0,
    };
    const result = mediaGuidance.mediaElementSizeOnPage(tooSmallImageElement);
    expect(result).not.toBeUndefined();
    expect(result.type).toStrictEqual('guidance');
    expect(result.elementId).toStrictEqual(tooSmallImageElement.id);
  });

  it('should return a message if a video element takes up <50% of the safe zone area', () => {
    const tooSmallVideoElement = {
      id: 456,
      type: 'video',
      height: PAGE_HEIGHT,
      width: PAGE_WIDTH,
      x: 0,
      y: -(PAGE_HEIGHT / 2) - 1,
    };
    const result = mediaGuidance.mediaElementSizeOnPage(tooSmallVideoElement);
    expect(result).not.toBeUndefined();
    expect(result.message).toMatchInlineSnapshot(
      `"Increase video or image size on the page"`
    );
    expect(result.type).toStrictEqual('guidance');
    expect(result.elementId).toStrictEqual(tooSmallVideoElement.id);
  });

  it('should ignore too small element if it is a background', () => {
    const tooSmallImageElement = {
      id: 123,
      type: 'image',
      height: 50,
      width: 50,
      x: 0,
      y: 0,
      isBackground: true,
    };
    const result = mediaGuidance.mediaElementSizeOnPage(tooSmallImageElement);
    expect(result).toBeUndefined();
  });

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
    expect(result.message).toMatchInlineSnapshot(`"Increase video resolution"`);
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
    expect(result.message).toMatchInlineSnapshot(`"Reduce video resolution"`);
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
    expect(result.message).toMatchInlineSnapshot(`"Break video into segments"`);
    expect(result.type).toStrictEqual('guidance');
    expect(result.elementId).toStrictEqual(tooLongVideo.id);
  });

  it.todo('should return a message if the video element is less than 24fps');
});
