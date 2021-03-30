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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { curatedFontNames, GOOGLE_MENU_FONT_URL } from '../constants';
import loadStylesheet from '../utils/loadStylesheet';
import getGoogleFontURL from '../utils/getGoogleFontURL';
import Context from './context';

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

function FontProvider({ children }) {
  const [fonts, setFonts] = useState([]);
  const [recentFonts, setRecentFonts] = useState([]);
  const menuFonts = useRef([]);

  const getFonts = useCallback(
    () =>
      import(/* webpackChunkName: "chunk-fonts" */ '../fonts.json').then(
        (res) => res.default
      ),
    []
  );

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
      return currentFont?.fallbacks || [];
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

  /**
   * Adds a <link> element to the <head> for a given font in case there is none yet.
   *
   * Allows dynamically enqueuing font styles when needed.
   *
   * @param {Array} fontsToEnqueue An array of fonts properties to create a valid FontFaceSet to inject and preload a font-face
   * @return {Promise} Returns fonts loaded promise
   */
  const maybeEnqueueFontStyle = useCallback((fontsToEnqueue) => {
    return Promise.all(
      fontsToEnqueue
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

            const handle = family.replace(/[\s./_]/g, '-').toLowerCase();
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

  const curatedFonts = useMemo(
    () => fonts.filter((font) => curatedFontNames.includes(font.name)),
    [fonts]
  );

  useEffect(() => {
    let mounted = true;
    async function loadFonts() {
      const newFonts = await getFonts();
      const formattedFonts = newFonts.map((font) => ({
        id: font.family,
        name: font.family,
        value: font.family,
        ...font,
      }));

      if (mounted) {
        setFonts(formattedFonts);
      }
    }

    loadFonts();

    return () => {
      mounted = false;
    };
  }, [getFonts]);

  const state = {
    state: {
      fonts,
      curatedFonts,
      recentFonts,
    },
    actions: {
      getFontByName,
      maybeEnqueueFontStyle,
      getFontWeight,
      getFontFallback,
      ensureMenuFontsLoaded,
      addRecentFont,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

FontProvider.propTypes = {
  children: PropTypes.node,
};

export default FontProvider;
