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
import { identity, useContextSelector } from '../../../../../design-system';
import Context from './context';

/** @typedef {import('./typedefs').Media3pApiContext} Media3pApiContext */

/**
 * Context value consumer to select a fragment of the context from
 * {@link ./media3pApiProvider}.
 *
 * @return {Media3pApiContext} The selected context value fragment.
 */
function useMedia3pApi() {
  // No selector because none of the context properties have a state because
  // they are currently all functions without state.
  return useContextSelector(Context, identity);
}

export default useMedia3pApi;
