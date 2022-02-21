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
import { useMemo } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import getCommonObjectValue from './getCommonObjectValue';

/**
 * Memoizes the value returned by the `getCommonObjectValue`.
 *
 * @param {Array.<Object>} list  List of objects
 * @param {string} property Property to check on all objects
 * @param {Object} defaultValue Default object when an element is missing it.
 * @return {Object} Found common object values or default values.
 */
function useCommonObjectValue(list, property, defaultValue) {
  const commonValue = getCommonObjectValue(list, property, defaultValue);
  const parts = Object.keys(defaultValue).map((prop) => commonValue[prop]);
  return useMemo(
    () => commonValue,
    // eslint-disable-next-line react-hooks/exhaustive-deps -- We don't want commonValue as a dep.
    parts
  );
}

export default useCommonObjectValue;
