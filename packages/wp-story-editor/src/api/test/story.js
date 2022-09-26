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
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * External dependencies
 */
import { bindToCallbacks } from '@web-stories-wp/wp-utils';

/**
 * Internal dependencies
 */
import * as apiCallbacks from '..';

jest.mock('@wordpress/api-fetch');

describe('Story API Callbacks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveStoryById', () => {
    it('uses provided story poster', async () => {
      apiFetch.mockReturnValue(
        Promise.resolve({
          id: 123,
          meta: {},
          story_poster: {
            id: 567,
            url: 'https://example.com/featuredimage.jpg',
            width: 640,
            height: 853,
            needsProxy: false,
          },
        })
      );
      const { saveStoryById } = bindToCallbacks(apiCallbacks, {
        api: { stories: '/web-stories/v1/web-story/' },
      });

      await expect(
        saveStoryById({
          storyId: 123,
          featuredMedia: {},
          author: {},
        })
      ).resolves.toStrictEqual(
        expect.objectContaining({
          id: 123,
          featuredMedia: {
            id: 567,
            url: 'https://example.com/featuredimage.jpg',
            width: 640,
            height: 853,
            needsProxy: false,
            isExternal: false,
          },
        })
      );
    });

    it('sets isExternal for hotlinked poster', async () => {
      apiFetch.mockReturnValue(
        Promise.resolve({
          id: 123,
          story_poster: {
            url: 'https://example.com/hotlinked.jpg',
            width: 640,
            height: 853,
            needsProxy: true,
          },
        })
      );
      const { saveStoryById } = bindToCallbacks(apiCallbacks, {
        api: { stories: '/web-stories/v1/web-story/' },
      });

      await expect(
        saveStoryById({
          storyId: 123,
          featuredMedia: {},
          author: {},
        })
      ).resolves.toStrictEqual(
        expect.objectContaining({
          id: 123,
          featuredMedia: {
            width: 640,
            height: 853,
            isExternal: true,
            needsProxy: true,
            url: 'https://example.com/hotlinked.jpg',
          },
        })
      );
    });

    it('returns "empty" object when there is no featured image', async () => {
      apiFetch.mockReturnValue(
        Promise.resolve({
          id: 123,
          story_poster: null,
        })
      );
      const { saveStoryById } = bindToCallbacks(apiCallbacks, {
        api: { stories: '/web-stories/v1/web-story/' },
      });

      await expect(
        saveStoryById({
          storyId: 123,
          featuredMedia: {},
          author: {},
        })
      ).resolves.toStrictEqual(
        expect.objectContaining({
          id: 123,
          featuredMedia: {
            id: 0,
            width: 0,
            height: 0,
            isExternal: false,
            needsProxy: false,
            url: '',
          },
        })
      );
    });
  });
});
