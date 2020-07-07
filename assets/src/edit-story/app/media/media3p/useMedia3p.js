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
 * Internal dependencies
 */
import useMedia from '../useMedia';

/**
 * Context value consumer to select a fragment of the media3p media context
 * value that's provided from {@link ./useContextValueProvider}.
 *
 * @param {function(Object):Object} selector Returns a fragment of the media
 * context value that the caller is interested in
 */
export function useMedia3p(selector) {
  return useMedia(({ media3p }) => selector(media3p));
}

/**
 * Context value consumer to select a fragment of a specific media3p provider's
 * media context value that's provided from
 * {@link ./useProviderContextValueProvider}.
 *
 * @param {string} provider The provider for which state will be returned
 * @param {function(Object):Object} selector Returns a fragment of the media
 * context value that the caller is interested in
 */
export function useMedia3pForProvider(provider, selector) {
  return useMedia(({ media3p }) => selector(media3p[provider]));
}
