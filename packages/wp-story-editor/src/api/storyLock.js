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
 * External dependencies
 */
import { addQueryArgs } from '@googleforcreators/url';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

export function getStoryLockById(config, storyId) {
  const path = addQueryArgs(`${config.api.stories}${storyId}/lock/`, {
    _embed: 'author',
  });

  return apiFetch({ path }).then(({ locked, nonce, _embedded }) => {
    const lockAuthor = {
      id: _embedded?.author?.[0]?.id || 0,
      name: _embedded?.author?.[0]?.name || '',
      avatar: _embedded?.author?.[0]?.avatar_urls?.['96'] || '',
    };

    return {
      locked,
      nonce,
      lockAuthor,
    };
  });
}

export function setStoryLockById(config, storyId) {
  const path = `${config.api.stories}${storyId}/lock/`;
  return apiFetch({ path, method: 'POST' });
}

export function deleteStoryLockById(config, storyId, nonce) {
  const data = new window.FormData();
  data.append('_wpnonce', nonce);

  const url = addQueryArgs(config.api.storyLocking, { _method: 'DELETE' });

  window.navigator.sendBeacon?.(url, data);
}
