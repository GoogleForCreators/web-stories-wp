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
import { useCallback, useEffect, useState } from '@web-stories-wp/react';
import { useConfig } from '@web-stories-wp/dashboard';

/**
 * Internal dependencies
 */
import {
  addCustomFont as addCustomFontCallback,
  getCustomFonts as getCustomFontsCallback,
  deleteCustomFont as deleteCustomFontCallback,
} from '../fonts';

export default function useFontsApi() {
  const {
    api: { fonts: fontsApiPath },
  } = useConfig();
  const [customFonts, setCustomFonts] = useState(null);

  const loadFonts = useCallback(() => {
    // @todo Use API call.
    /*const fonts = await getCustomFonts();
    if (!fonts) {
      setAddedFonts([]);
    } else {
      setAddedFonts(fonts);
    }*/
    setCustomFonts([
      { id: 1, name: 'Font 1', url: 'https://example.com/font1.otf' },
      { id: 2, name: 'Font 2', url: 'https://example.com/font2.woff' },
    ]);
  }, []);

  useEffect(() => {
    if (null === customFonts) {
      loadFonts();
    }
  }, [loadFonts, customFonts]);

  const fetchCustomFonts = useCallback(() => {
    getCustomFontsCallback(fontsApiPath)
      .then((response) => {
        const filteredFonts = response.map(({ id, family, url }) => ({
          id,
          family,
          url,
        }));
        setCustomFonts(filteredFonts);
      })
      .catch(() => null);
  }, [fontsApiPath]);

  const deleteCustomFont = useCallback(
    async (id) => {
      try {
        const response = await deleteCustomFontCallback(fontsApiPath, id);
        return response;
      } catch (e) {
        return null;
      }
    },
    [fontsApiPath]
  );

  const addCustomFont = useCallback(
    async (font) => {
      try {
        const response = await addCustomFontCallback(fontsApiPath, font);
        return response;
      } catch (e) {
        return null;
      }
    },
    [fontsApiPath]
  );

  return {
    customFonts,
    api: { addCustomFont, fetchCustomFonts, deleteCustomFont },
  };
}
