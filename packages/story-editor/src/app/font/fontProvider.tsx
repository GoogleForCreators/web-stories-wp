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
import type { PropsWithChildren } from 'react';
import { useCallback, useRef, useState } from '@googleforcreators/react';
import { CURATED_FONT_NAMES } from '@googleforcreators/fonts';
import { loadStylesheet } from '@googleforcreators/dom';
import type { FontData } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { FONT_WEIGHT_NAMES } from '../../constants';
import { useAPI } from '../api';
import Context from './context';
import useLoadFontFiles from './actions/useLoadFontFiles';
import { GOOGLE_MENU_FONT_URL } from './constants';
import type { FontWeightOption } from './types';

function FontProvider({ children }: PropsWithChildren<unknown>) {
  const [queriedFonts, setQueriedFonts] = useState<FontData[]>([]);
  const [curatedFonts, setCuratedFonts] = useState<FontData[]>([]);
  const [recentFonts, setRecentFonts] = useState<FontData[]>([]);
  const [customFonts, setCustomFonts] = useState<FontData[] | null>(null);
  const {
    actions: { getFonts },
  } = useAPI();

  const fonts = queriedFonts.length > 0 ? queriedFonts : curatedFonts;

  const loadCustomFonts = useCallback(async () => {
    if (customFonts || !getFonts) {
      return;
    }

    const _customFonts = await getFonts({
      service: 'custom',
    });

    if (!_customFonts.length) {
      return;
    }

    const formattedFonts = _customFonts.map((font) => ({
      ...font,
      // The font picker & preview expects the ID to be the font family name.
      id: font.family,
      name: font.family,
      value: font.family,
    }));

    setCustomFonts(formattedFonts);
  }, [getFonts, customFonts]);

  const loadCuratedFonts = useCallback(async () => {
    if (curatedFonts.length || !getFonts) {
      return;
    }

    const newFonts = await getFonts({
      include: CURATED_FONT_NAMES.join(','),
    });

    if (!newFonts.length) {
      return;
    }

    const formattedFonts = newFonts.map((font) => ({
      id: font.family,
      name: font.family,
      value: font.family,
      ...font,
    }));

    setCuratedFonts(formattedFonts);
  }, [getFonts, curatedFonts]);

  const { maybeEnqueueFontStyle, maybeLoadFont } = useLoadFontFiles();

  const getFontByName = useCallback(
    (name: string) => {
      const foundFont = fonts.find((font) => font.family === name);
      return foundFont ? foundFont : null;
    },
    [fonts]
  );

  const getFontsBySearch = useCallback(
    async (search: string) => {
      if (search.length < 2) {
        setQueriedFonts([]);
        return [];
      }

      const newFonts = (await getFonts?.({ search })) || [];

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
    (name: string) => {
      const defaultFontWeights: FontWeightOption[] = [
        { name: FONT_WEIGHT_NAMES[400], value: 400 },
      ];

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
    (name: string) => {
      const currentFont = getFontByName(name);
      return currentFont?.fallbacks ? currentFont.fallbacks : [];
    },
    [getFontByName]
  );

  const addRecentFont = useCallback(
    (recentFont: FontData) => {
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

  const menuFontsRef = useRef<string[]>([]);
  const ensureMenuFontsLoaded = useCallback((fontsToLoad: string[]) => {
    const newMenuFonts = fontsToLoad.filter(
      (fontName) => !menuFontsRef.current.includes(fontName)
    );
    if (!newMenuFonts?.length) {
      return;
    }
    menuFontsRef.current = menuFontsRef.current.concat(newMenuFonts);

    // Create new <link> in head with ref to new font families
    const families = encodeURIComponent(newMenuFonts.join('|'));
    const url = `${GOOGLE_MENU_FONT_URL}?family=${families}&subset=menu&display=swap`;
    loadStylesheet(url, 'web-stories-google-fonts-menu-css').catch(() => {
      // If they failed to load, remove from array again!
      menuFontsRef.current = menuFontsRef.current.filter(
        (font) => !newMenuFonts.includes(font)
      );
    });
  }, []);

  const ensureCustomFontsLoaded = useCallback(
    (fontsToLoad) => {
      for (const font of fontsToLoad) {
        const fontObj = customFonts?.find(({ family }) => family === font);

        if (!fontObj) {
          continue;
        }

        void maybeLoadFont(fontObj);
      }
    },
    [customFonts, maybeLoadFont]
  );

  const state = {
    state: {
      fonts: queriedFonts.length > 0 ? queriedFonts : curatedFonts,
      curatedFonts,
      customFonts,
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
      loadCustomFonts,
      loadCuratedFonts,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

export default FontProvider;
