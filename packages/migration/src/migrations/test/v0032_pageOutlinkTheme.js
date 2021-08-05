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
import pageOutlinkTheme from '../v0032_pageOutlinkTheme';

describe('pageOutlinkTheme', () => {
  it('should add theme to page outlink', () => {
    expect(
      pageOutlinkTheme({
        _test: 'story',
        pages: [
          {
            _test: 'page1',
            elements: [],
            pageAttachment: {
              url: 'https://example.test',
              ctaText: 'Learn',
            },
          },
        ],
      })
    ).toStrictEqual({
      _test: 'story',
      pages: [
        {
          _test: 'page1',
          elements: [],
          pageAttachment: {
            url: 'https://example.test',
            ctaText: 'Learn',
            theme: 'light',
          },
        },
      ],
    });
  });

  it('should not do anything in case of outlink not being set', () => {
    expect(
      pageOutlinkTheme({
        _test: 'story',
        pages: [
          {
            _test: 'page1',
            elements: [],
          },
        ],
      })
    ).toStrictEqual({
      _test: 'story',
      pages: [
        {
          _test: 'page1',
          elements: [],
        },
      ],
    });
  });

  it('should not override existing page outlink theme', () => {
    expect(
      pageOutlinkTheme({
        _test: 'story',
        pages: [
          {
            _test: 'page1',
            elements: [],
            pageAttachment: {
              url: 'https://example.test',
              ctaText: 'Learn',
              theme: 'dark',
            },
          },
        ],
      })
    ).toStrictEqual({
      _test: 'story',
      pages: [
        {
          _test: 'page1',
          elements: [],
          pageAttachment: {
            url: 'https://example.test',
            ctaText: 'Learn',
            theme: 'dark',
          },
        },
      ],
    });
  });
});
