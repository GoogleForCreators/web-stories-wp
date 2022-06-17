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

// https://codesandbox.io/s/restless-wildflower-g6z22m?file=/src/useEyeDropper.js

function hexToRgbA(hex) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    c = '0x' + c.join('');
    return {
      r: (c >> 16) & 255,
      g: (c >> 8) & 255,
      b: c & 255,
      a: 1,
    };
  }
  throw new Error(`Unable to convert to hex ${hex}`);
}

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
        const rgba = hexToRgbA(result.sRGBHex);
        onChange(rgba);
      })
      .catch((e) => {
        //eslint-disable-next-line no-console -- Surface error for debugging.
        console.log(e.message);
      });
  }, [eyeDropper, isEyeDropperApiSupported, onChange]);

  return { isEyeDropperApiSupported, openEyeDropper };
}

export default useEyeDropperApi;
