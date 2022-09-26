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

describe('User API Callbacks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const API_PATH = '/web-stories/v1/users/me/';

  it('getCurrentUser maps arguments to expected format', async () => {
    apiFetch.mockReturnValue(
      Promise.resolve({
        id: 1234,
        meta: {
          web_stories_tracking_optin: true,
          web_stories_onboarding: 'foobar',
          web_stories_media_optimization: false,
        },
      })
    );
    const { getCurrentUser } = bindToCallbacks(apiCallbacks, {
      api: { currentUser: API_PATH },
    });

    await expect(getCurrentUser()).resolves.toStrictEqual(
      expect.objectContaining({
        id: 1234,
        trackingOptin: true,
        onboarding: 'foobar',
        mediaOptimization: false,
      })
    );
  });

  it('updateCurrentUser maps arguments to expected format', async () => {
    apiFetch.mockReturnValue(
      Promise.resolve({
        id: 1234,
        meta: {
          web_stories_tracking_optin: true,
          web_stories_onboarding: 'foobar',
          web_stories_media_optimization: false,
        },
      })
    );

    const { updateCurrentUser } = bindToCallbacks(apiCallbacks, {
      api: { currentUser: API_PATH },
    });

    await expect(
      updateCurrentUser({
        trackingOptin: false,
        onboarding: 'baz',
        mediaOptimization: true,
      })
    ).resolves.toStrictEqual(
      expect.objectContaining({
        id: 1234,
        trackingOptin: true,
        onboarding: 'foobar',
        mediaOptimization: false,
      })
    );
    expect(apiFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        path: API_PATH,
        method: 'POST',
        data: {
          meta: {
            web_stories_tracking_optin: false,
            web_stories_onboarding: 'baz',
            web_stories_media_optimization: true,
          },
        },
      })
    );
  });
});
