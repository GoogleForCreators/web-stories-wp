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
import { identity } from '../../../../design-system';
import useMedia from '../useMedia';

/**
 * @typedef {import('./typedefs').LocalMediaContext} LocalMediaContext
 */

/**
 * Context value consumer to select a fragment of the locally uploaded media
 * context value that's provided from {@link ./useContextValueProvider}.
 *
 * @param {function(LocalMediaContext):Object?} selector Returns a fragment of the media
 * context value that the caller is interested in. If no selector is provided
 * then the entire context is selected.
 * @return {Object} The selected context value fragment.
 */
function useLocalMedia(selector) {
  return useMedia(({ local }) => (selector ?? identity)(local));
}

export default useLocalMedia;
