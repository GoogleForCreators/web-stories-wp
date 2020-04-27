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
import { useCallback } from 'react';

/**
 * This is a utility ensure that Promise.all return ONLY when all promises are processed.
 *
 * @param {Promise} promise Promise to be processed
 * @return {Promise} Return a rejected or fulfilled Promise
 */
const reflect = (promise) => {
  return promise.then(
    (v) => ({ v, status: 'fulfilled' }),
    (e) => ({ e, status: 'rejected' })
  );
};

function useLoadFontFiles({ getFontByName }) {
  /**
   * Adds a <link> element to the <head> for a given font in case there is none yet.
   *
   * Allows dynamically enqueuing font styles when needed.
   *
   * @param {Object} props An object with properties to create a valid FontFaceSet to inject and preload a font-face
   * @return {Promise} Returns font load promise
   */
  const maybeEnqueueFontStyle = useCallback(
    ({ fontFamily, fontWeight, fontStyle, fontSize } = { fontSize: 0 }) => {
      const { handle, src } = getFontByName(fontFamily);
      if (!fontFamily || !fontWeight || !fontStyle || !handle) {
        return null;
      }
      const fontFaceSet = `${fontStyle} ${fontWeight} ${fontSize}px '${fontFamily}'`;
      const elementId = `${handle}-css`;

      const hasFontLink = () => {
        return handle && document.getElementById(elementId);
      };

      const appendFontLink = () => {
        return new Promise((resolve, reject) => {
          const fontStylesheet = document.createElement('link');
          const fontHref = `${src}&display=auto`.replace('&display=swap', '');
          fontStylesheet.id = elementId;
          fontStylesheet.href = fontHref;
          fontStylesheet.rel = 'stylesheet';
          fontStylesheet.type = 'text/css';
          fontStylesheet.media = 'all';
          fontStylesheet.crossOrigin = 'anonymous';
          fontStylesheet.addEventListener('load', () => resolve());
          fontStylesheet.addEventListener('error', (e) => reject(e));
          return document.head.appendChild(fontStylesheet);
        });
      };

      const ensureFontLoaded = () => {
        return new Promise((resolve, reject) => {
          if (document?.fonts) {
            document.fonts.load(fontFaceSet).then(() => {
              if (document.fonts.check(fontFaceSet)) {
                resolve();
              } else {
                reject(
                  new Error(`font-family: ${fontFamily} found, but not loaded.`)
                );
              }
            });
          } else {
            resolve();
          }
        });
      };

      if (!hasFontLink(fontFamily)) {
        return appendFontLink().then(() => ensureFontLoaded());
      }
      return ensureFontLoaded();
    },
    [getFontByName]
  );

  /**
   * It allows control each text element font-face for multiple types and font family aspect
   *
   * @param {string} aspect Font family aspect that should be synced between one or more elements
   * @param {Object} state Font family state to be synced with `maybeEnqueueFontStyle`
   * @param {Array} elements List of elements selected to be processed
   * @return {Promise} Returns a Promise after process all font with `maybeEnqueueFontStyle`
   */
  const ensureFontFaceSetIsAvaialble = (aspect, state, elements) => {
    const fontFamilies = elements.map((e) => ({
      ...e,
      [aspect]: state[aspect],
    }));
    return Promise.all(
      fontFamilies.map((family) => maybeEnqueueFontStyle(family)).map(reflect)
    );
  };

  return {
    maybeEnqueueFontStyle,
    ensureFontFaceSetIsAvaialble,
  };
}

export default useLoadFontFiles;
