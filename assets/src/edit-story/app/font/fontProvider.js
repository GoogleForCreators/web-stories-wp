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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { useCallback, useState, useRef } from 'react';

/**
 * Internal dependencies
 */
import Context from './context';

import useLoadFonts from './effects/useLoadFonts';
import useLoadFontFiles from './actions/useLoadFontFiles';

const GOOGLE_MENU_FONT_URL = 'https://fonts.googleapis.com/css';

function FontProvider({ children }) {
  const loadedFontFamily = useRef([]);
  const [fonts, setFonts] = useState([]);
  const [recentUsedFontValues, setRecentUsedFontValues] = useState([]);

  useLoadFonts({ fonts, setFonts });

  const insertUsedFont = (value) => {
    const findFontIndex = recentUsedFontValues.findIndex(
      (fontValue) => fontValue === value
    );
    if (findFontIndex < 0) {
      const newUsedFonts = recentUsedFontValues.slice();
      newUsedFonts.push(value);
      setRecentUsedFontValues(newUsedFonts);
    }
  };

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
      return getFontBy('family', name);
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
      const fontFallback =
        currentFont && currentFont.fallbacks ? currentFont.fallbacks : [];
      return fontFallback;
    },
    [getFontByName]
  );

  const getMenuFonts = useCallback((fontFamilyList) => {
    const newFontList = fontFamilyList.filter(
      (fontName) =>
        loadedFontFamily.current.findIndex((name) => name === fontName) < 0
    );
    if (!newFontList?.length) {
      return new Promise((resolve) => resolve(''));
    }
    return fetch(
      `${GOOGLE_MENU_FONT_URL}?family=${encodeURI(
        newFontList.join('|')
      )}&subset=menu`
    )
      .then((response) => response.body)
      .then((body) => {
        return body
          .getReader()
          .read()
          .then(({ value }) => {
            const decoder = new TextDecoder('utf-8');
            const decodedResult = decoder.decode(value);
            loadedFontFamily.current = [
              ...loadedFontFamily.current,
              ...newFontList,
            ];
            return decodedResult;
          });
      });
  }, []);

  const maybeEnqueueFontStyle = useLoadFontFiles({ getFontByName });

  const state = {
    state: {
      fonts,
      recentUsedFontValues,
    },
    actions: {
      insertUsedFont,
      getFontByName,
      maybeEnqueueFontStyle,
      getFontWeight,
      getFontFallback,
      getMenuFonts,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

FontProvider.propTypes = {
  children: PropTypes.node,
};

export default FontProvider;
