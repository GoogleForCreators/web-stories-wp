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
 * Internal dependencies
 */
import {
  toggleWebStoriesTrackingOptIn,
  toggleWebStoriesMediaOptimization,
} from '../user';

jest.mock('@wordpress/api-fetch', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve({})),
}));

describe('User API Callbacks', () => {
  const currentUserPath = '/web-stories/v1/users/me';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Payload `__PAYLOAD_DATA__.meta.web_stories_tracking_optin` must be flipped value
  it('toggleWebStoriesTrackingOptIn: validate request payload & path', () => {
    const currentUser = {
      meta: {
        webStoriesMediaOptimization: false,
      },
    };
    toggleWebStoriesTrackingOptIn(currentUserPath, currentUser);
    expect(apiFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        path: currentUserPath,
        data: {
          meta: {
            web_stories_tracking_optin: true,
          },
        },
      })
    );
  });

  // Payload `__PAYLOAD_DATA__.meta.webStoriesMediaOptimization` must be flipped value
  it('toggleWebStoriesMediaOptimization: validate request payload & path', () => {
    const currentUser = {
      meta: {
        webStoriesMediaOptimization: false,
      },
    };
    toggleWebStoriesMediaOptimization(currentUserPath, currentUser);
    expect(apiFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        path: currentUserPath,
        data: {
          meta: {
            web_stories_media_optimization: true,
          },
        },
      })
    );
  });
});
