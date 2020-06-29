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
import { useMemo, useState } from 'react';
import { useFeatures } from 'flagged';

/**
 * Internal dependencies
 */
import { useInsertElement } from '../canvas';
import Context from './context';

export const TAB_IDS = {
  MEDIA: 'media',
  MEDIA3P: 'media3p',
  TEXT: 'text',
  SHAPES: 'shapes',
  ELEMENTS: 'elements',
  ANIMATION: 'animation',
};

function LibraryProvider({ children }) {
  const [tab, setTab] = useState(TAB_IDS.MEDIA);
  const insertElement = useInsertElement();

  const { showAnimationTab, showElementsTab, media3pTab } = useFeatures();

  // Order here is important, as it denotes the actual visual order of elements.
  const tabs = useMemo(
    () =>
      [
        TAB_IDS.MEDIA,
        media3pTab ? TAB_IDS.MEDIA3P : null,
        TAB_IDS.TEXT,
        TAB_IDS.SHAPES,
        showElementsTab ? TAB_IDS.ELEMENTS : null,
        showAnimationTab ? TAB_IDS.ANIMATION : null,
      ].filter(Boolean),
    [media3pTab, showAnimationTab, showElementsTab]
  );

  const state = useMemo(
    () => ({
      state: {
        tab,
      },
      actions: {
        setTab,
        insertElement,
      },
      data: {
        tabs: tabs,
      },
    }),
    [tab, insertElement, tabs]
  );

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

LibraryProvider.propTypes = {
  children: PropTypes.node,
};

export default LibraryProvider;
