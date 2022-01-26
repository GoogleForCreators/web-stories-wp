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
import backgroundAudioFormatting from '../v0039_backgroundAudioFormatting';

describe('backgroundAudioFormatting', () => {
  it('should move properties', () => {
    expect(
      backgroundAudioFormatting({
        backgroundAudio: {
          src: 'https://example.com/audio.mp3',
          id: 123,
          mimeType: 'audio/mpeg',
        },
        pages: [
          {
            backgroundAudio: {
              src: 'https://example.com/audio.mp3',
              id: 123,
              mimeType: 'audio/mpeg',
            },
            elements: [
              {
                _test: 'element1',
                type: 'square',
                x: 10,
                y: 20,
                width: 100,
                height: 200,
              },
            ],
          },
          {
            elements: [
              {
                _test: 'element1',
                type: 'square',
                x: 10,
                y: 20,
                width: 100,
                height: 200,
              },
            ],
          },
        ],
      })
    ).toStrictEqual({
      backgroundAudio: {
        resource: {
          src: 'https://example.com/audio.mp3',
          id: 123,
          mimeType: 'audio/mpeg',
        },
      },
      pages: [
        {
          backgroundAudio: {
            loop: true,
            resource: {
              src: 'https://example.com/audio.mp3',
              id: 123,
              mimeType: 'audio/mpeg',
            },
            tracks: [],
          },
          elements: [
            {
              _test: 'element1',
              type: 'square',
              x: 10,
              y: 20,
              width: 100,
              height: 200,
            },
          ],
        },
        {
          elements: [
            {
              _test: 'element1',
              type: 'square',
              x: 10,
              y: 20,
              width: 100,
              height: 200,
            },
          ],
        },
      ],
    });
  });
});
