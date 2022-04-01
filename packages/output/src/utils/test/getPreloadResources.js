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
import getPreloadResources from '../getPreloadResources';

const IMAGE_ELEMENT = {
  id: 'baz',
  type: 'image',
  mimeType: 'image/png',
  scale: 1,
  origRatio: 9 / 16,
  x: 50,
  y: 100,
  height: 1920,
  width: 1080,
  rotationAngle: 0,
  loop: true,
  resource: {
    type: 'image',
    mimeType: 'image/png',
    id: 123,
    src: 'https://example.com/image.png',
    poster: 'https://example.com/poster.png',
    height: 1920,
    width: 1080,
  },
};

const VIDEO_ELEMENT = {
  id: '123',
  type: 'video',
  mimeType: 'video/mp4',
  scale: 1,
  origRatio: 9 / 16,
  x: 50,
  y: 100,
  height: 1920,
  width: 1080,
  rotationAngle: 0,
  loop: true,
  resource: {
    type: 'video',
    mimeType: 'video/mp4',
    id: 123,
    src: 'https://example.com/video.mp4',
    poster: 'https://example.com/poster.png',
    height: 1920,
    width: 1080,
    length: 99,
  },
};

const GIF_ELEMENT = {
  id: '048426c8-69ae-4e04-80f1-8f3fd4434261',
  type: 'gif',
  opacity: 100,
  x: 65,
  y: 196,
  width: 281,
  height: 223,
  scale: 100,
  rotationAngle: 0,
  resource: {
    type: 'gif',
    mimeType: 'image/gif',
    creationDate: '2016-02-04T18:16:22Z',
    src: 'https://c.tenor.com/4F2m7BWP6KYAAAAC/flying-kiss-muah.gif',
    width: 281,
    height: 223,
    alt: '',
    attribution: {
      author: [],
      registerUsageUrl:
        'https://media3p.googleapis.com/v1/media:registerUsage?token=AX7RMSdePGQBB3c/QAOBJ20QC%2BZNp2A549gSosisUYOjIC71nkvySPH5yj%2BqDBOVBmmFZ89azzUAN9x2GjkNbq3OXauUMho%3D',
    },
    output: {
      mimeType: 'video/mp4',
      src: 'https://c.tenor.com/4F2m7BWP6KYAAAPo/flying-kiss-muah.mp4',
    },
  },
};

describe('getPreloadResources', () => {
  it('should bail early on empty pages', () => {
    const result = getPreloadResources([]);
    expect(result).toStrictEqual([]);
  });

  it('should ignore non-background elements', () => {
    const pages = [
      {
        elements: [IMAGE_ELEMENT, GIF_ELEMENT, VIDEO_ELEMENT],
      },
    ];
    const result = getPreloadResources(pages);
    expect(result).toStrictEqual([]);
  });

  it("should add the first page's background video", () => {
    const pages = [
      {
        elements: [{ ...VIDEO_ELEMENT, isBackground: true }],
      },
    ];
    const result = getPreloadResources(pages);
    expect(result).toStrictEqual([
      {
        url: 'https://example.com/video.mp4',
        type: 'video',
      },
    ]);
  });

  it("should add the first page's background image", () => {
    const pages = [
      {
        elements: [{ ...IMAGE_ELEMENT, isBackground: true }],
      },
    ];
    const result = getPreloadResources(pages);
    expect(result).toStrictEqual([
      {
        url: 'https://example.com/image.png',
        type: 'image',
      },
    ]);
  });

  it("should add the first page's background GIF", () => {
    const pages = [
      {
        elements: [{ ...GIF_ELEMENT, isBackground: true }],
      },
    ];
    const result = getPreloadResources(pages);
    expect(result).toStrictEqual([
      {
        url: 'https://c.tenor.com/4F2m7BWP6KYAAAPo/flying-kiss-muah.mp4',
        type: 'video',
      },
    ]);
  });
});
