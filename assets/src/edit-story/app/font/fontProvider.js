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
import { useCallback, useState, useRef, useEffect } from 'react';

/**
 * Internal dependencies
 */
import loadStylesheet from '../../utils/loadStylesheet';
import { useStory } from '../story';
import Context from './context';
import useLoadFonts from './effects/useLoadFonts';
import useLoadFontFiles from './actions/useLoadFontFiles';
import useGetRecentFonts from './useGetRecentFonts';

const GOOGLE_MENU_FONT_URL = 'https://fonts.googleapis.com/css';

function FontProvider({ children }) {
  const { currentPage, pages } = useStory((state) => ({
    currentPage: state.state.currentPage,
    pages: state.state.pages,
  }));
  const [fonts, setFonts] = useState([]);

  const getRecentFonts = useGetRecentFonts();
  const [recentFonts, setRecentFonts] = useState([]);

  const countRef = useRef({
    elementCount: currentPage?.elements?.length
      ? currentPage.elements.filter(({ type }) => type === 'text').length
      : 0,
    pageCount: pages?.length || 1,
  });

  /*
   * This effect checks if the number of text elements on the current page has changed
   * or if a page has been added/removed and updates the recent fonts if yes.
   */
  useEffect(() => {
    const { pageCount, elementCount } = countRef.current;
    if (
      currentPage?.elements &&
      pages &&
      (pages.length !== pageCount ||
        currentPage.elements.filter(({ type }) => type === 'text').length !==
          elementCount)
    ) {
      setRecentFonts(getRecentFonts(fonts));
    }
    countRef.current = {
      elementCount: currentPage?.elements?.length
        ? currentPage.elements.filter(({ type }) => type === 'text').length
        : 0,
      pageCount: pages?.length || 1,
    };
  }, [currentPage, pages, fonts, getRecentFonts]);

  useEffect(() => {
    if (fonts.length) {
      setRecentFonts(getRecentFonts(fonts));
    }
  }, [fonts, getRecentFonts]);

  useLoadFonts({ fonts, setFonts });

  const updateRecentFonts = useCallback(() => {
    setRecentFonts(getRecentFonts(fonts));
  }, [getRecentFonts, fonts]);

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

  const menuFonts = useRef([]);
  const ensureMenuFontsLoaded = useCallback((menuFontsRequested) => {
    const newMenuFonts = menuFontsRequested.filter(
      (fontName) => !menuFonts.current.includes(fontName)
    );
    if (!newMenuFonts?.length) {
      return;
    }
    menuFonts.current = menuFonts.current.concat(newMenuFonts);

    // Create new <link> in head with ref to new font families
    const families = encodeURIComponent(newMenuFonts.join('|'));
    const url = `${GOOGLE_MENU_FONT_URL}?family=${families}&subset=menu&display=swap`;
    loadStylesheet(url).catch(() => {
      // If they failed to load, remove from array again!
      menuFonts.current = menuFonts.current.filter(
        (font) => !newMenuFonts.includes(font)
      );
    });
  }, []);

  const maybeEnqueueFontStyle = useLoadFontFiles({ getFontByName });

  const state = {
    state: {
      fonts,
      recentFonts,
    },
    actions: {
      getFontByName,
      maybeEnqueueFontStyle,
      getFontWeight,
      getFontFallback,
      ensureMenuFontsLoaded,
      updateRecentFonts,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

FontProvider.propTypes = {
  children: PropTypes.node,
};

export default FontProvider;
