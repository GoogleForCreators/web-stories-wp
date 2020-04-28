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
import { useCallback, useState, useEffect } from 'react';

/**
 * Internal dependencies
 */
import Context from './context';

import useLoadFonts from './effects/useLoadFonts';
import useLoadFontFiles from './actions/useLoadFontFiles';

function FontProvider({ children }) {
  const [fonts, setFonts] = useState([]);
  const [fontFaces, setFontFaces] = useState([]);
  const [recentUsedFontSlugs, setRecentUsedFontSlugs] = useState([]);

  useLoadFonts({ fonts, setFonts });

  const addUsedFont = (slug) => {
    const findFontIndex = recentUsedFontSlugs.findIndex(
      (fontSlug) => fontSlug === slug
    );
    if (findFontIndex < 0) {
      const newUsedFontSlugs = recentUsedFontSlugs.slice();
      newUsedFontSlugs.push(slug);
      setRecentUsedFontSlugs(newUsedFontSlugs);
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

  const getMenuFonts = useCallback((fontList) => {
    const googleMenuFontsUrl = 'https://fonts.googleapis.com/css';
    return fetch(
      `${googleMenuFontsUrl}?family=${fontList.join('|')}&subset=menu`
    )
      .then((response) => response.body)
      .then((body) => {
        return body
          .getReader()
          .read()
          .then(({ value }) => {
            const decoder = new TextDecoder('utf-8');
            return decoder.decode(value).replace(/::MENU/g, '');
          });
      });
  }, []);

  useEffect(() => {
    if (fonts?.length > 0) {
      getMenuFonts(fonts.map((font) => font.name)).then((result) => {
        const resultArray = result.replace(/}/g, '}},').split('},');
        setFontFaces(resultArray);
      });
    }
  }, [fonts, getMenuFonts]);

  const maybeEnqueueFontStyle = useLoadFontFiles({ getFontByName });

  const state = {
    state: {
      fonts,
      fontFaces,
      recentUsedFontSlugs,
    },
    actions: {
      addUsedFont,
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
