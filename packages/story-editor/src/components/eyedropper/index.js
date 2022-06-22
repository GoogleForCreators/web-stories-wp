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
import { useCallback } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useCanvas, useLayout } from '../../app';
import { ZOOM_SETTING } from '../../constants';
import useEyeDropperApi from './useEyeDropperApi';

export default ({ onChange }) => {
  const {
    fullbleedContainer,
    eyedropperPixelData,
    setEyedropperCallback,
    setIsEyedropperActive,
    setEyedropperImg,
    setEyedropperPixelData,
  } = useCanvas(
    ({
      state: { fullbleedContainer, eyedropperPixelData },
      actions: {
        setEyedropperCallback,
        setIsEyedropperActive,
        setEyedropperImg,
        setEyedropperPixelData,
      },
    }) => ({
      fullbleedContainer,
      setEyedropperCallback,
      eyedropperPixelData,
      setIsEyedropperActive,
      setEyedropperImg,
      setEyedropperPixelData,
    })
  );

  const { isEyeDropperApiSupported, openEyeDropper } = useEyeDropperApi({
    onChange,
  });

  const { zoomSetting, setZoomSetting } = useLayout(
    ({ state: { zoomSetting }, actions: { setZoomSetting } }) => ({
      zoomSetting,
      setZoomSetting,
    })
  );

  const initEyedropper = useCallback(
    (resetZoom = true) =>
      async () => {
        if (isEyeDropperApiSupported) {
          if (resetZoom) {
            openEyeDropper();
          }

          // pointer event just return
          return;
        }

        if (!resetZoom && zoomSetting !== ZOOM_SETTING.FIT) {
          return;
        }
        if (resetZoom) {
          setIsEyedropperActive(true);
        }
        const prepareEyedropper = () =>
          new Promise((resolve) => {
            // Wait one tick for the zoom to settle in.
            setTimeout(() => {
              import(
                /* webpackChunkName: "chunk-html-to-image" */ 'html-to-image'
              ).then((htmlToImage) => {
                htmlToImage
                  .toCanvas(fullbleedContainer, {
                    preferredFontFormat: 'woff2',
                    pixelRatio: 1,
                  })
                  .then((canvas) => {
                    const ctx = canvas.getContext('2d');
                    const pixelData = ctx.getImageData(
                      0,
                      0,
                      canvas.width,
                      canvas.height
                    ).data;
                    setEyedropperPixelData(pixelData);
                    setEyedropperImg(canvas.toDataURL());
                    resolve();
                  })
                  .catch(() => {
                    resolve();
                  });
              });
            });
          });

        if (!eyedropperPixelData || !resetZoom) {
          if (resetZoom) {
            setZoomSetting(ZOOM_SETTING.FIT);
          }
          await prepareEyedropper();
        }

        setEyedropperCallback(() => (rgbObject) => {
          onChange({ color: rgbObject });
          setIsEyedropperActive(false);
          setEyedropperImg(null);
          setEyedropperPixelData(null);
        });
      },
    [
      fullbleedContainer,
      onChange,
      eyedropperPixelData,
      zoomSetting,
      setIsEyedropperActive,
      setEyedropperCallback,
      setEyedropperImg,
      setEyedropperPixelData,
      setZoomSetting,
      isEyeDropperApiSupported,
      openEyeDropper,
    ]
  );

  return { initEyedropper };
};
