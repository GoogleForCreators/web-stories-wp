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
import { useCallback, useEffect, useState } from 'react';

/**
 * Internal dependencies
 */
import Context from '../../../edit-story/app/font/context';
import useLoadFontFiles from '../../../edit-story/app/font/actions/useLoadFontFiles';

function FontProvider({ children }) {
  const [fonts, setFonts] = useState([]);

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

  const getFonts = useCallback(
    () =>
      import(/* webpackChunkName: "chunk-fonts" */ '../../../fonts/fonts').then(
        (res) => res.default
      ),
    []
  );

  useEffect(() => {
    let mounted = true;
    async function loadFonts() {
      const newFonts = await getFonts();
      const formattedFonts = newFonts.map((font) => ({
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

  const maybeEnqueueFontStyle = useLoadFontFiles({ getFontByName });

  const state = {
    state: {
      fonts,
    },
    actions: {
      maybeEnqueueFontStyle,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

FontProvider.propTypes = {
  children: PropTypes.node,
};

export default FontProvider;
