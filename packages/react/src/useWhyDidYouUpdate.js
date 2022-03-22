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
import { useEffect, useRef } from './react';

/**
 * Hook to see which prop changes are causing a component to re-render.
 *
 * Only used for development, and removed for production builds.
 *
 * @see https://github.com/gragland/usehooks
 * @param {string} name Component name.
 * @param {Object} props Component props.
 */
function useWhyDidYouUpdate(name, props) {
  const previousProps = useRef();

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changesObj = {};

      allKeys.forEach((key) => {
        if (previousProps.current[key] !== props[key]) {
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changesObj).length) {
        // eslint-disable-next-line no-console -- Needed for debugging.
        console.log('[why-did-you-update]', name, changesObj);
      }
    }

    previousProps.current = props;
  });
}

const isDevelopment =
  typeof WEB_STORIES_ENV !== 'undefined' && WEB_STORIES_ENV === 'development';

export default isDevelopment ? useWhyDidYouUpdate : () => {};
