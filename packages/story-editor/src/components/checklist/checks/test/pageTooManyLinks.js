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
import { pageTooManyLinks } from '../pageTooManyLinks';

describe('pageTooManyLinks', () => {
  it('should return true if page has too many links', () => {
    const linkElements = [
      {
        type: 'text',
        link: {
          url: 'https://google.com',
        },
      },
      {
        type: 'image',
        link: {
          url: 'https://google.com',
        },
      },
      {
        type: 'text',
        link: {
          url: 'https://google.com',
        },
      },
      {
        type: 'text',
        link: {
          url: 'https://google.com',
        },
      },
    ];

    const page = {
      id: 'pageid',
      elements: [
        { type: 'text' },
        { type: 'video' },
        {
          type: 'text',
          link: {
            url: '',
          },
        },
        ...linkElements,
      ],
    };
    expect(pageTooManyLinks(page)).toBe(true);
  });

  it('should return undefined if page has a reasonable number of links', () => {
    const page = {
      elements: [
        { type: 'text' },
        { type: 'video' },
        {
          type: 'text',
          link: {
            url: 'https://google.com',
          },
        },
        {
          type: 'image',
          link: {
            url: 'https://google.com',
          },
        },
        {
          type: 'text',
          link: {
            url: '',
          },
        },
        {
          type: 'text',
          link: {
            url: 'https://google.com',
          },
        },
      ],
    };
    expect(pageTooManyLinks(page)).toBeFalse();
  });
});
