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
import { useCallback } from '@googleforcreators/react';
import { getGoogleFontURL, getFontCSS } from '@googleforcreators/fonts';
import {
  loadStylesheet,
  ensureFontLoaded,
  loadInlineStylesheet,
} from '@googleforcreators/dom';

/**
 * Internal dependencies
 */
import cleanForSlug from '../../../utils/cleanForSlug';

function useLoadFontFiles() {
  const maybeLoadFont = useCallback(async (font) => {
    const { family, service, variants, url } = font;

    const handle = cleanForSlug(family);
    const elementId = `web-stories-${handle}-font-css`;

    const hasFontLink = () =>
      typeof document !== 'undefined'
        ? document.getElementById(elementId)
        : null;

    if (hasFontLink()) {
      return;
    }

    switch (service) {
      case 'fonts.google.com':
        await loadStylesheet(
          getGoogleFontURL([{ family, variants }], 'auto'),
          elementId
        );
        break;
      case 'custom':
        await loadInlineStylesheet(elementId, getFontCSS(family, url));
        break;
      default:
        return;
    }
  }, []);

  /**
   * Enqueue a list of given fonts by adding <link> or <style> elements.
   *
   * Allows dynamically enqueuing font styles when needed.
   *
   * @param {Array} fonts An array of fonts properties to create a valid FontFaceSet to inject and preload a font-face
   * @return {Promise<boolean>} Returns fonts loaded promise
   */
  const maybeEnqueueFontStyle = useCallback(
    (fonts) => {
      return Promise.allSettled(
        fonts.map(async ({ font, fontWeight, fontStyle, content }) => {
          const { family, service } = font;
          if (!family || service === 'system') {
            return null;
          }

          const fontFaceSet = `
              ${fontStyle || ''} ${fontWeight || ''} 0 '${family}'
            `.trim();

          await maybeLoadFont(font);

          return ensureFontLoaded(fontFaceSet, content);
        })
      );
    },
    [maybeLoadFont]
  );

  return {
    maybeEnqueueFontStyle,
    maybeLoadFont,
  };
}

export default useLoadFontFiles;
