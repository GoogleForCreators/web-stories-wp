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

function useLoadFontFiles() {
  /**
   * Adds a <link> element to the <head> for a given font in case there is none yet.
   *
   * Allows dynamically enqueuing font styles when needed.
   *
   * @param {string} name Font name.
   */
  const maybeEnqueueFontStyle = useCallback(({ family, service, variants }) => {
    if (!family || service !== 'fonts.google.com') {
      return;
    }

    const handle = cleanForSlug(family);
    const id = `${handle}-css`;
    const element = document.getElementById(id);

    if (element) {
      return;
    }

    const src = getGoogleFontURL([{ family, variants }]);

    const fontStylesheet = document.createElement('link');
    fontStylesheet.id = id;
    fontStylesheet.href = src;
    fontStylesheet.rel = 'stylesheet';
    fontStylesheet.type = 'text/css';
    fontStylesheet.media = 'all';
    fontStylesheet.crossOrigin = 'anonymous';

    document.head.appendChild(fontStylesheet);
  }, []);

  return maybeEnqueueFontStyle;
}

export default useLoadFontFiles;
