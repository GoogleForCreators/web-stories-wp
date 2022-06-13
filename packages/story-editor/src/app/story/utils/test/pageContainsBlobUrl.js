/*
 * Copyright 2022 Google LLC
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
import pageContainsBlobUrl from '../pageContainsBlobUrl';

describe('pageContainsBlobUrl', () => {
  it('should find resource entry with blob url', () => {
    const pages = [
      {
        elements: [
          {
            resource: {
              src: 'https://example.com/bcee4374-8f8a-4210-8f2d-9c5f8d6a6c5a',
            },
          },
          {
            resource: {
              src: 'blob:https://example.com/ecee4374-8f8a-4210-8f2d-9c5f8d6a6c5a',
            },
          },
        ],
      },
    ];
    expect(pageContainsBlobUrl(pages)).toBe(true);
  });

  it('should find resource poster entry with blob url', () => {
    const pages = [
      {
        elements: [
          {
            type: 'text',
            font: {
              family: 'Arial',
              service: 'system',
            },
          },
        ],
      },
      {
        elements: [
          {
            resource: {
              poster:
                'https://example.com/ecee4374-8f8a-4210-8f2d-9c5f8d6a6c5a',
            },
          },
          {
            resource: {
              poster:
                'blob:https://example.com/ecee4374-8f8a-4210-8f2d-9c5f8d6a6c5a',
            },
          },
        ],
      },
    ];
    expect(pageContainsBlobUrl(pages)).toBe(true);
  });

  it('should allow page entries without blob urls', () => {
    const pages = [
      {
        elements: [
          {
            type: 'text',
            font: {
              family: 'Arial',
              service: 'system',
            },
          },
          {
            resource: {
              src: 'https://example.com/bcee4374-8f8a-4210-8f2d-9c5f8d6a6c5a',
            },
          },
          {
            resource: {
              src: 'https://example.com/ccee4374-8f8a-4210-8f2d-9c5f8d6a6c5a',
            },
          },
        ],
      },
    ];

    expect(pageContainsBlobUrl(pages)).toBe(false);
  });
});
