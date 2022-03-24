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
import { useCallback, useEffect, useState } from '@googleforcreators/react';
import { useConfig } from '@googleforcreators/dashboard';

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

  useEffect(() => {
    if (null === customFonts) {
      fetchCustomFonts();
    }
  }, [fetchCustomFonts, customFonts]);

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
    (font) => addCustomFontCallback(fontsApiPath, font),
    [fontsApiPath]
  );

  return {
    customFonts,
    api: { addCustomFont, fetchCustomFonts, deleteCustomFont },
  };
}
