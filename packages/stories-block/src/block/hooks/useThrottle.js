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
import { throttle } from 'lodash';

/**
 * WordPress dependencies
 */
import { useEffect, useMemo } from '@wordpress/element';

/**
 * Throttles a function with Lodash's `throttle`. A new throttled function will
 * be returned and any scheduled calls cancelled if any of the arguments change,
 * including the function to throttle, so please wrap functions created on
 * render in components in `useCallback`.
 *
 * Replacement for the same hook from the `@wordpress/compose` package which is
 * not available in WordPress 5.5.
 *
 * @todo Remove once WordPress 5.5 is no longer required.
 * @see https://docs-lodash.com/v4/throttle/
 * @see https://github.com/WordPress/gutenberg/blob/4fdffac83552063c56a71f5c5dd96359c2a580be/packages/compose/src/hooks/use-throttle/index.js
 * @param {Function}                             fn        The function to throttle.
 * @param {number}                            [wait]    The number of milliseconds to throttle invocations to.
 * @param {import('lodash').ThrottleSettings} [options] The options object. See linked documentation for details.
 * @return {import('lodash').Cancelable} Throttled function.
 */
export default function useThrottle(fn, wait, options) {
  const throttled = useMemo(
    () => throttle(fn, wait, options),
    [fn, wait, options]
  );
  useEffect(() => () => throttled.cancel(), [throttled]);
  return throttled;
}
