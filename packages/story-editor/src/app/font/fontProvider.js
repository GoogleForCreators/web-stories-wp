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
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from '@web-stories-wp/react';
import { CURATED_FONT_NAMES } from '@web-stories-wp/fonts';

/**
 * Internal dependencies
 */
import { trackError } from '@web-stories-wp/tracking';
import loadStylesheet from '../../utils/loadStylesheet';
import { FONT_WEIGHT_NAMES } from '../../constants';
import { useAPI } from '../api';
import Context from './context';
import useLoadFontFiles from './actions/useLoadFontFiles';

export const GOOGLE_MENU_FONT_URL = 'https://fonts.googleapis.com/css';

function FontProvider({ children }) {
  const [queriedFonts, setQueriedFonts] = useState([]);
  const [curatedFonts, setCuratedFonts] = useState([]);
  const [recentFonts, setRecentFonts] = useState([]);
  const {
    actions: { getFonts },
  } = useAPI();

  const fonts = queriedFonts.length > 0 ? queriedFonts : curatedFonts;

  useEffect(() => {
    let mounted = true;

    if (!curatedFonts.length) {
      try {
        (async () => {
          const newFonts = await getFonts({
            include: CURATED_FONT_NAMES.join(','),
          });
          console.log('get new fonts');
          if (!mounted) {
            console.log('not mounted');
            return;
          }

          const formattedFonts = newFonts.map((font) => ({
            id: font.family,
            name: font.family,
            value: font.family,
            ...font,
          }));
          console.log('set fonts');
          setCuratedFonts(formattedFonts);
        })();
      } catch (err) {
        console.log('something went wrong fonts ', err.message);
        trackError('font_provider', err.message);
      }
    }

    return () => {
      mounted = false;
    };
  }, [curatedFonts, getFonts]);

  const { maybeEnqueueFontStyle, maybeLoadFont } = useLoadFontFiles();

  const getFontByName = useCallback(
    (name) => {
      const foundFont = fonts.find((font) => font.family === name);
      return foundFont ? foundFont : {};
    },
    [fonts]
  );

  const getFontsBySearch = useCallback(
    async (search) => {
      if (search.length < 2) {
        setQueriedFonts([]);
        return [];
      }

      const newFonts = await getFonts({
        search,
      });

      const formattedFonts = newFonts.map((font) => ({
        ...font,
        id: font.family,
        name: font.family,
        value: font.family,
      }));

      setQueriedFonts(formattedFonts);
      return formattedFonts;
    },
    [getFonts]
  );

  const getFontWeight = useCallback(
    (name) => {
      const defaultFontWeights = [{ name: FONT_WEIGHT_NAMES[400], value: 400 }];

      const currentFont = getFontByName(name);
      let fontWeights = defaultFontWeights;
      if (currentFont) {
        const { weights } = currentFont;
        if (weights) {
          fontWeights = weights.map((weight) => ({
            name: FONT_WEIGHT_NAMES[weight],
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
      return currentFont?.fallbacks ? currentFont.fallbacks : [];
    },
    [getFontByName]
  );

  const addRecentFont = useCallback(
    (recentFont) => {
      const newRecentFonts = [recentFont];
      recentFonts.forEach((font) => {
        if (recentFont.family === font.family) {
          return;
        }
        newRecentFonts.push(font);
      });
      setRecentFonts(newRecentFonts.slice(0, 5));
    },
    [recentFonts]
  );

  const menuFonts = useRef([]);
  const ensureMenuFontsLoaded = useCallback((fontsToLoad) => {
    const newMenuFonts = fontsToLoad.filter(
      (fontName) => !menuFonts.current.includes(fontName)
    );
    if (!newMenuFonts?.length) {
      return;
    }
    menuFonts.current = menuFonts.current.concat(newMenuFonts);

    // Create new <link> in head with ref to new font families
    const families = encodeURIComponent(newMenuFonts.join('|'));
    const url = `${GOOGLE_MENU_FONT_URL}?family=${families}&subset=menu&display=swap`;
    loadStylesheet(url, 'web-stories-google-fonts-menu-css').catch(() => {
      // If they failed to load, remove from array again!
      menuFonts.current = menuFonts.current.filter(
        (font) => !newMenuFonts.includes(font)
      );
    });
  }, []);

  const ensureCustomFontsLoaded = useCallback(
    (fontsToLoad) => {
      console.log('ensure custom fonts loaded');
      for (const font of fontsToLoad) {
        const fontObj = fonts.find(({ family }) => family === font);
        if (!fontObj) {
          console.log('continue');
          continue;
        }
        console.log('maybe load this font: ', JSON.stringify(fontObj));
        maybeLoadFont(fontObj);
      }
    },
    [fonts, maybeLoadFont]
  );

  const state = {
    state: {
      fonts: queriedFonts.length > 0 ? queriedFonts : curatedFonts,
      curatedFonts,
      recentFonts,
    },
    actions: {
      getFontsBySearch,
      getFontByName,
      maybeEnqueueFontStyle,
      getFontWeight,
      getFontFallback,
      ensureMenuFontsLoaded,
      ensureCustomFontsLoaded,
      addRecentFont,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

FontProvider.propTypes = {
  children: PropTypes.node,
};

export default FontProvider;
