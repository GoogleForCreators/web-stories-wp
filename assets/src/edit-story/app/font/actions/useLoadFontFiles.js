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
 * Internal dependencies
 */
import cleanForSlug from '../../../utils/cleanForSlug';
import getGoogleFontURL from '../../../utils/getGoogleFontURL';

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

function useLoadFontFiles() {
  /**
   * Adds a <link> element to the <head> for a given font in case there is none yet.
   *
   * Allows dynamically enqueuing font styles when needed.
   *
   * @param {Object} props An object with properties to create a valid FontFaceSet to inject and preload a font-face
   * @return {Promise} Returns font load promise
   */
  const maybeEnqueueFontStyle = useCallback(
    async (
      {
        font: { family, service, variants },
        fontWeight,
        fontStyle,
        fontSize,
      } = { fontSize: 0 }
    ) => {
      if (
        !family ||
        !fontWeight ||
        !fontStyle ||
        service !== 'fonts.google.com'
      ) {
        return null;
      }

      const handle = cleanForSlug(family);
      const elementId = `${handle}-css`;
      const fontFaceSet = `${fontStyle} ${fontWeight} ${fontSize}px '${family}'`;

      const hasFontLink = () => {
        return document.getElementById(elementId);
      };

      const appendFontLink = () => {
        return new Promise((resolve, reject) => {
          const src = getGoogleFontURL([{ family, variants }]);
          const fontStylesheet = document.createElement('link');
          const fontHref = src.replace('display=swap', 'display=auto');
          fontStylesheet.id = elementId;
          fontStylesheet.href = fontHref;
          fontStylesheet.rel = 'stylesheet';
          fontStylesheet.type = 'text/css';
          fontStylesheet.media = 'all';
          fontStylesheet.crossOrigin = 'anonymous';
          fontStylesheet.addEventListener('load', () => resolve());
          fontStylesheet.addEventListener('error', (e) => reject(e));
          document.head.appendChild(fontStylesheet);
        });
      };

      const ensureFontLoaded = async () => {
        if (document?.fonts) {
          await document.fonts.load(fontFaceSet);
          return document.fonts.check(fontFaceSet);
        } else {
          return null;
        }
      };

      if (!hasFontLink()) {
        await appendFontLink();
      }

      return ensureFontLoaded();
    },
    []
  );

  /**
   * It allows control each text element font-face for multiple types and font family aspect
   *
   * @param {string} aspect Font family aspect that should be synced between one or more elements
   * @param {Object} state Font family state to be synced with `maybeEnqueueFontStyle`
   * @param {Array} elements List of elements selected to be processed
   * @return {Promise} Returns a Promise after process all font with `maybeEnqueueFontStyle`
   */
  const ensureFontFaceSetIsAvailable = (aspect, state, elements) => {
    const currentFontConfigs = elements.map((e) => ({
      ...e,
      [aspect]: state[aspect],
    }));
    return Promise.all(
      currentFontConfigs
        .map((currentFontConfig) => maybeEnqueueFontStyle(currentFontConfig))
        .map(reflect)
    );
  };

  return {
    maybeEnqueueFontStyle,
    ensureFontFaceSetIsAvailable,
  };
}

export default useLoadFontFiles;
