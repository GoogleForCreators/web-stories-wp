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
import { getSolidFromHex } from '@googleforcreators/patterns';
import { noop } from '@googleforcreators/design-system';
import { rgbToColorString, parseToRgb } from 'polished';

function useEyeDropperApi({ onChange = noop, handleClose = noop }) {
  const isEyeDropperApiSupported =
    typeof window !== 'undefined' && 'EyeDropper' in window;
  const eyeDropper = useRef(null);

  useEffect(() => {
    if (isEyeDropperApiSupported && !eyeDropper.current) {
      eyeDropper.current = new window.EyeDropper();
    }
  }, [isEyeDropperApiSupported]);

  const openEyeDropper = useCallback(async () => {
    if (!eyeDropper.current || !isEyeDropperApiSupported) {
      return;
    }

    try {
      const { sRGBHex } = await eyeDropper.current.open();
      // Per documentation, `sRGBHex` should always be a hex color but is not.
      const hexColor =
        typeof sRGBHex === 'string' && sRGBHex[0] === '#'
          ? sRGBHex
          : rgbToColorString(parseToRgb(sRGBHex));
      onChange(getSolidFromHex(hexColor.substring(1)).color);
    } catch (e) {
      //eslint-disable-next-line no-console -- Surface error for debugging.
      console.log(e.message);
    } finally {
      handleClose();
    }
  }, [eyeDropper, isEyeDropperApiSupported, onChange, handleClose]);

  return { isEyeDropperApiSupported, openEyeDropper };
}

export default useEyeDropperApi;
