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
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Context from './context';

import useLoadFonts from './effects/useLoadFonts';
import useLoadFontFiles from './actions/useLoadFontFiles';

function FontProvider({ children }) {
  const [fonts, setFonts] = useState([]);

  useLoadFonts({ fonts, setFonts });

  const getFontBy = useCallback(
    (key, value) => {
      const foundFont = fonts.find((thisFont) => thisFont[key] === value);
      if (!foundFont) {
        return {};
      }
      return foundFont;
    },
    [fonts]
  );

  const getFontByName = useCallback(
    (name) => {
      return getFontBy('name', name);
    },
    [getFontBy]
  );

  const getFontBySlug = useCallback(
    (slug) => {
      return getFontBy('slug', slug);
    },
    [getFontBy]
  );

  const getFontWeight = useCallback(
    (name) => {
      const fontWeightNames = {
        100: __('Thin', 'web-stories'),
        200: __('Extra-light', 'web-stories'),
        300: __('Light', 'web-stories'),
        400: __('Regular', 'web-stories'),
        500: __('Medium', 'web-stories'),
        600: __('Semi-bold', 'web-stories'),
        700: __('Bold', 'web-stories'),
        800: __('Extra-bold', 'web-stories'),
        900: __('Black', 'web-stories'),
      };

      const defaultFontWeights = [{ name: fontWeightNames[400], value: 400 }];

      const currentFont = getFontByName(name);
      let fontWeights = defaultFontWeights;
      if (currentFont) {
        const { weights } = currentFont;
        if (weights) {
          fontWeights = weights.map((weight) => ({
            name: fontWeightNames[weight],
            value: weight,
          }));
        }
      }
      return fontWeights;
    },
    [getFontByName]
  );

  const getFontFallback = useCallback(
    (name) => {
      const currentFont = getFontByName(name);
      return currentFont?.fallback || [];
    },
    [getFontByName]
  );

  const maybeEnqueueFontStyle = useLoadFontFiles({ getFontByName });

  const state = {
    state: {
      fonts,
    },
    actions: {
      getFontByName,
      getFontBySlug,
      maybeEnqueueFontStyle,
      getFontWeight,
      getFontFallback,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

FontProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default FontProvider;
