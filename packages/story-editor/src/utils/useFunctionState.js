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
import { useState, useCallback } from 'react';

/**
 * It's a bit weird to directly set a state to be a function (as setFoo calls
 * any function given to unwrap the inner value, which can then be a function),
 * so we use a wrapper object in stead of double-functioning.
 *
 * @param {Function} initialValue  Initial value of the variable
 * @return {Array} Array of value, setter and clearer.
 */
function useFunctionState(initialValue = undefined) {
  const [value, setValue] = useState({ handler: initialValue });

  const setter = useCallback(
    (handler) =>
      setValue({
        handler: typeof handler === 'function' ? handler : undefined,
      }),
    [setValue]
  );

  const clearer = useCallback(() => setValue({ handler: undefined }), [
    setValue,
  ]);

  return [value.handler, setter, clearer];
}

export default useFunctionState;
