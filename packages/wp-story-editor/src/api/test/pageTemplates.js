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
 * External dependencies
 */
import { bindToCallbacks } from '@web-stories-wp/wp-utils';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import * as apiCallbacks from '..';

jest.mock('@wordpress/api-fetch');

describe('pageTemplates', () => {
  afterEach(() => {
    apiFetch.mockReset();
  });

  describe('getCustomPageTemplates', () => {
    it('should always provide id and elements', async () => {
      apiFetch.mockReturnValue(
        Promise.resolve({
          headers: {
            'X-WP-TotalPages': 20,
          },
          body: [
            {
              id: 123,
              story_data: { id: 'page-id', elements: [{ id: 'foo' }] },
            },
            { id: 456, story_data: [] },
          ],
        })
      );

      const { getCustomPageTemplates } = bindToCallbacks(apiCallbacks, {
        api: { pageTemplates: '/web-stories/v1/web-story-page/' },
      });

      await expect(getCustomPageTemplates(1)).resolves.toStrictEqual({
        hasMore: true,
        templates: [
          {
            elements: [{ id: 'foo' }],
            id: 'page-id',
            image: { height: 0, id: 0, url: '', width: 0 },
            templateId: 123,
          },
          {
            elements: [],
            id: 456,
            image: { height: 0, id: 0, url: '', width: 0 },
            templateId: 456,
          },
        ],
      });
    });
  });
});
