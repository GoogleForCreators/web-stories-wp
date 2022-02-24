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
 * External dependencies
 */
import { useEffect } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import useFormContext from './useFormContext';

/**
 * @param {Function} handler The handler function with three arguments: the new
 * element state, the element's updated properties, and the old element state.
 * @param {Array|undefined} deps The handler dependencies. See `useCallback`.
 */
function usePresubmitHandler(handler, deps = undefined) {
  const registerPresubmitHandler = useFormContext(
    (value) => value.registerPresubmitHandler
  );
  useEffect(
    () => registerPresubmitHandler(handler),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Pass through provided deps.
    [registerPresubmitHandler].concat(deps || [])
  );
}

export default usePresubmitHandler;
