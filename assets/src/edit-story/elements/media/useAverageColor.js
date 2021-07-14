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
import { useRef, useEffect, useLayoutEffect } from 'react';

function useAverageColor(ref, onAverageColor) {
  const callback = useRef(onAverageColor);
  useEffect(() => {
    callback.current = onAverageColor;
  }, [onAverageColor]);

  useLayoutEffect(() => {
    function checkAverageColor() {
      try {
        import(
          /* webpackPrefetch: true, webpackChunkName: "chunk-colorthief" */ 'colorthief'
        ).then(({ default: ColorThief }) => {
          const thief = new ColorThief();
          callback.current(thief.getColor(ref.current));
        });
      } catch (e) {
        // ColorThief fails for all-white images
        //
        // It's a "feature":
        // https://github.com/lokesh/color-thief/pull/49
        callback.current([255, 255, 255]);
      }
    }

    const element = ref.current;

    if (!element) {
      return undefined;
    }

    // element.complete indicates whether the browser has finished fetching the image, whether successful or not.
    // That means this value is also true if the image has no `src` value indicating an image to load.
    // Hence also checking for `src` here.
    if (element.src && element.complete) {
      checkAverageColor();

      return undefined;
    }

    element.addEventListener('load', checkAverageColor);
    return () => element.removeEventListener('load', checkAverageColor);
  }, [ref]);
}

export default useAverageColor;
