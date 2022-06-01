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
import removeTrackName from '../v0042_removeTrackName';

describe('removeTrackName', () => {
  it('should move properties', () => {
    expect(
      removeTrackName({
        backgroundAudio: {
          src: 'https://example.com/audio.mp3',
          id: 123,
          mimeType: 'audio/mpeg',
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
              tracks: [
                {
                  track: 'https://example.com/track.vtt',
                  trackId: 123,
                  trackName: 'track.vtt',
                  id: 'rersd-fdfd-fdfd-fdfd',
                  srcLang: '',
                  label: '',
                  kind: 'captions',
                },
              ],
            },
            elements: [],
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
            tracks: [
              {
                track: 'https://example.com/track.vtt',
                trackId: 123,
                id: 'rersd-fdfd-fdfd-fdfd',
                srcLang: '',
                label: '',
                kind: 'captions',
              },
            ],
          },
          elements: [],
        },
      ],
    });
  });
});
