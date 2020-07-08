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

// TODO(https://github.com/google/web-stories-wp/issues/2802):
// Implement, re-using logic from media/common/useContextValueProvider.js.
/**
 * Context fragment provider for a single 3p media source (Unsplash, Coverr,
 * etc).
 *
 * @param {string} provider The 3p provider to return the context value for
 * @param {Object} reducerState The 'media3p/[provider]' fragment of the state
 * returned from `useMediaReducer`
 */
export default function useProviderContextValueProvider(
  provider,
  reducerState
) {
  return {
    state: reducerState[provider],
  };
}
