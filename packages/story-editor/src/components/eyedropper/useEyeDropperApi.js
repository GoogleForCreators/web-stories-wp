/*
 * Copyright 2022 Google LLC
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
import { useEffect, useCallback, useRef } from 'react';
import { getSolidFromHex } from "@googleforcreators/patterns";

function useEyeDropperApi({ onChange }) {
  const isEyeDropperApiSupported =
    (typeof window !== 'undefined') & ('EyeDropper' in window);

  const eyeDropper = useRef(false);

  useEffect(() => {
    if (isEyeDropperApiSupported && !eyeDropper.current) {
      eyeDropper.current = new window.EyeDropper();
    }
  }, [isEyeDropperApiSupported]);

  const openEyeDropper = useCallback(() => {
    if (!eyeDropper.current || !isEyeDropperApiSupported) {
      return;
    }

    eyeDropper.current
      .open()
      .then((result) => {
        onChange(getSolidFromHex(result.sRGBHex.substring(1)).color);
      })
      .catch((e) => {
        //eslint-disable-next-line no-console -- Surface error for debugging.
        console.log(e.message);
      });
  }, [eyeDropper, isEyeDropperApiSupported, onChange]);

  return { isEyeDropperApiSupported, openEyeDropper };
}

export default useEyeDropperApi;
