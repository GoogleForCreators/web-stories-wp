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

function useLoadFontFiles({ getFontByName }) {
  /**
   * Adds a <link> element to the <head> for a given font in case there is none yet.
   *
   * Allows dynamically enqueuing font styles when needed.
   *
   * @param {string} fontFamily Font name.
   */
  const maybeEnqueueFontStyle = useCallback(
    ({ fontFamily, fontWeight, fontStyle, content }) => {
      return new Promise((resolve, reject) => {
        // skip when required infos are not declared
        if (!fontFamily || !fontWeight || !fontStyle) {
          return null;
        }

        const fontFaceSet = `${fontStyle} ${fontWeight} 0 '${fontFamily}'`;
        const { handle, src } = getFontByName(fontFamily);
        if (handle) {
          const element = document.getElementById(`${handle}-css`);
          if (element) {
            if (document?.fonts && document.fonts.check(fontFaceSet)) {
              return resolve();
            }
            element.remove();
          }
        } else {
          return null;
        }

        const fontStylesheet = document.createElement('link');
        fontStylesheet.id = `${handle}-css`;
        fontStylesheet.href = src;
        fontStylesheet.rel = 'stylesheet';
        fontStylesheet.type = 'text/css';
        fontStylesheet.media = 'all';
        fontStylesheet.crossOrigin = 'anonymous';

        const linkEl = document.head.appendChild(fontStylesheet);

        linkEl.addEventListener('load', async () => {
          if (document?.fonts) {
            await document.fonts.load(fontFaceSet, content);
            if (document.fonts.check(fontFaceSet)) {
              return resolve();
            } else {
              return reject(
                new Error(`font-family: ${fontFamily} found, but not loaded.`)
              );
            }
          }
          return resolve();
        });

        linkEl.addEventListener('error', (e) => reject(e));

        return linkEl;
      });
    },
    [getFontByName]
  );

  return maybeEnqueueFontStyle;
}

export default useLoadFontFiles;
