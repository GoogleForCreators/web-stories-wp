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
import useFetchMediaEffect from './useFetchMediaEffect';

/**
 * Context fragment provider for a single 3p media source (Unsplash, Coverr,
 * etc).
 *
 * @param provider The 3p provider to return the context value for
 * @param reducerState The 'media3p/[provider]' fragment of the state
 * returned from {@link useMediaReducer}
 * @param reducerActions The 'media3p/[provider]' fragment of the actions
 * returned from {@link useMediaReducer}
 */
export default function useProviderContextValueProvider(
  provider,
  reducerState,
  reducerActions
) {
  const { selectedProvider } = reducerState;
  const { pageToken } = reducerState[provider];
  const {
    fetchMediaStart,
    fetchMediaSuccess,
    fetchMediaError,
  } = reducerActions;

  // Fetch or re-fetch media when the state has changed.
  useFetchMediaEffect({
    provider,
    selectedProvider,
    pageToken,
    fetchMediaStart,
    fetchMediaSuccess,
    fetchMediaError,
  });

  return {
    state: reducerState[provider],
  };
}
