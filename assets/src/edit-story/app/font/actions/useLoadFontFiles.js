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
   * @param {Array} fonts An array of fonts properties to create a valid FontFaceSet to inject and preload a font-face
   * @return {Promise} Returns fonts loaded promise
   */
  const maybeEnqueueFontStyle = useCallback((fonts) => {
    return Promise.all(
      fonts
        .map(
          async ({
            font: { family, service, variants },
            fontWeight,
            fontStyle,
            content,
          }) => {
            if (!family || service !== 'fonts.google.com') {
              return null;
            }

            const handle = cleanForSlug(family);
            const elementId = `${handle}-css`;
            const fontFaceSet = `
              ${fontStyle || ''} ${fontWeight || ''} 0 '${family}'
            `.trim();

            const hasFontLink = () => document.getElementById(elementId);

            const appendFontLink = () => {
              return new Promise((resolve, reject) => {
                const src = getGoogleFontURL([{ family, variants }], 'auto');
                const fontStylesheet = document.createElement('link');
                fontStylesheet.id = elementId;
                fontStylesheet.href = src;
                fontStylesheet.rel = 'stylesheet';
                fontStylesheet.type = 'text/css';
                fontStylesheet.media = 'all';
                fontStylesheet.crossOrigin = 'anonymous';
                fontStylesheet.addEventListener('load', () => resolve());
                fontStylesheet.addEventListener('error', (e) => reject(e));
                document.head.appendChild(fontStylesheet);
              });
            };

            const ensureFontLoaded = () => {
              if (!document?.fonts) {
                return Promise.resolve();
              }

              return document.fonts
                .load(fontFaceSet, content || '')
                .then(() => document.fonts.check(fontFaceSet, content || ''));
            };

            if (!hasFontLink()) {
              await appendFontLink();
            }

            return ensureFontLoaded();
          }
        )
        .map(reflect)
    );
  }, []);

  return maybeEnqueueFontStyle;
}

export default useLoadFontFiles;
