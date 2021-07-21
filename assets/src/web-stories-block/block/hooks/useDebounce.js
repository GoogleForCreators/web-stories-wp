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
import { debounce } from 'lodash';

/**
 * WordPress dependencies
 */
import { useEffect, useMemo } from '@wordpress/element';

/**
 * Debounces a function with Lodash's `debounce`. A new debounced function will
 * be returned and any scheduled calls cancelled if any of the arguments change,
 * including the function to debounce, so please wrap functions created on
 * render in components in `useCallback`.
 *
 * Replacement for the same hook from the `@wordpress/compose` package which is
 * not available in WordPress 5.5.
 *
 * @todo Remove once WordPress 5.5 is no longer required.
 * @see https://docs-lodash.com/v4/debounce/
 * @see https://github.com/WordPress/gutenberg/blob/4fdffac83552063c56a71f5c5dd96359c2a580be/packages/compose/src/hooks/use-debounce/index.js
 * @param {Function}                          fn        The function to debounce.
 * @param {number}                            [wait]    The number of milliseconds to delay.
 * @param {import('lodash').DebounceSettings} [options] The options object.
 * @return {import('lodash').Cancelable} Debounced function.
 */
export default function useDebounce(fn, wait, options) {
  const debounced = useMemo(
    () => debounce(fn, wait, options),
    [fn, wait, options]
  );
  useEffect(() => () => debounced.cancel(), [debounced]);
  return debounced;
}
