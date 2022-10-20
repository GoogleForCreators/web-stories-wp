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

export function getStoryLockById(storyId, stories) {
  const path = addQueryArgs(`${stories}${storyId}/lock/`, {
    _embed: 'author',
  });

  return apiFetch({ path });
}

export function setStoryLockById(storyId, stories) {
  const path = `${stories}${storyId}/lock/`;
  return apiFetch({ path, method: 'POST' });
}

export function deleteStoryLockById(storyId, nonce, storyLocking) {
  const data = new window.FormData();
  data.append('_wpnonce', nonce);

  const url = addQueryArgs(storyLocking, { _method: 'DELETE' });

  window.navigator.sendBeacon?.(url, data);
}
