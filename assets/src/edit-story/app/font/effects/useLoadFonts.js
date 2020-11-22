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
import { useEffect } from 'react';

/**
 * Internal dependencies
 */
import { useFile } from '../../file';

function useLoadFonts({ fonts, setFonts }) {
  const fontsLength = fonts.length;
  const {
    actions: { getFonts },
  } = useFile();
  useEffect(() => {
    async function loadFonts() {
      const newFonts = await getFonts();
      const formattedFonts = newFonts.map((font) => ({
        id: font.family,
        name: font.family,
        value: font.family,
        ...font,
      }));

      setFonts(formattedFonts);
    }
    if (!fontsLength) {
      loadFonts();
    }
  }, [fontsLength, setFonts, getFonts]);
}

export default useLoadFonts;
