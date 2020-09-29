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
import convertOverlayPattern from '../v0023_convertOverlayPattern';

describe('convertOverlayPattern', () => {
  it('should ignore missing overlays, non-media backgrounds and empty pages', () => {
    expect(
      convertOverlayPattern({
        pages: [
          {
            elements: [
              {
                type: 'image',
                isBackground: true,
              },
            ],
          },
          {
            backgroundOverlay: 'none',
            elements: [
              {
                type: 'image',
                isBackground: true,
              },
            ],
          },
          {
            backgroundOverlay: 'random',
            elements: [
              {
                type: 'image',
                isBackground: true,
              },
            ],
          },
          {
            backgroundOverlay: 'linear',
            elements: [
              {
                type: 'shape',
                isBackground: true,
              },
            ],
          },
          {
            backgroundOverlay: 'linear',
            elements: [],
          },
        ],
      })
    ).toStrictEqual({
      pages: [
        {
          elements: [
            {
              type: 'image',
              isBackground: true,
            },
          ],
        },
        {
          elements: [
            {
              type: 'image',
              isBackground: true,
            },
          ],
        },
        {
          elements: [
            {
              type: 'image',
              isBackground: true,
            },
          ],
        },
        {
          elements: [
            {
              type: 'shape',
              isBackground: true,
            },
          ],
        },
        {
          elements: [],
        },
      ],
    });
  });

  it('should convert solid overlays', () => {
    expect(
      convertOverlayPattern({
        pages: [
          {
            backgroundOverlay: 'solid',
            elements: [
              {
                type: 'video',
                isBackground: true,
              },
            ],
          },
        ],
      })
    ).toStrictEqual({
      pages: [
        {
          elements: [
            {
              type: 'video',
              backgroundOverlay: { color: { r: 0, g: 0, b: 0, a: 0.3 } },
              isBackground: true,
            },
          ],
        },
      ],
    });
  });

  it('should convert linear overlays', () => {
    expect(
      convertOverlayPattern({
        pages: [
          {
            backgroundOverlay: 'linear',
            elements: [
              {
                type: 'image',
                isBackground: true,
              },
            ],
          },
        ],
      })
    ).toStrictEqual({
      pages: [
        {
          elements: [
            {
              type: 'image',
              backgroundOverlay: {
                type: 'linear',
                rotation: 0,
                stops: [
                  { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0.4 },
                  { color: { r: 0, g: 0, b: 0, a: 1 }, position: 1 },
                ],
                alpha: 0.9,
              },
              isBackground: true,
            },
          ],
        },
      ],
    });
  });

  it('should convert radial overlays', () => {
    expect(
      convertOverlayPattern({
        pages: [
          {
            backgroundOverlay: 'radial',
            elements: [
              {
                type: 'video',
                isBackground: true,
              },
            ],
          },
        ],
      })
    ).toStrictEqual({
      pages: [
        {
          elements: [
            {
              type: 'video',
              backgroundOverlay: {
                type: 'radial',
                size: { w: 0.8, h: 0.5 },
                stops: [
                  { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0.25 },
                  { color: { r: 0, g: 0, b: 0, a: 1 }, position: 1 },
                ],
                alpha: 0.6,
              },
              isBackground: true,
            },
          ],
        },
      ],
    });
  });
});
