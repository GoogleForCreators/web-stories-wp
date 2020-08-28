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
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useInsertElement } from '../canvas';
import Context from './context';
import { AnimationPane, AnimationIcon } from './panes/animation';
import { MediaPane, MediaIcon } from './panes/media/local';
import { Media3pPane, Media3pIcon } from './panes/media/media3p';
import { ShapesPane, ShapesIcon } from './panes/shapes';
import { TextPane, TextIcon } from './panes/text';
import { ElementsPane, ElementsIcon } from './panes/elements';

const MEDIA = {
  icon: MediaIcon,
  Pane: MediaPane,
  id: 'media',
  ariaLabel: __('Media Gallery', 'web-stories'),
};
const MEDIA3P = {
  icon: Media3pIcon,
  Pane: Media3pPane,
  id: 'media3p',
  ariaLabel: __('Explore Media', 'web-stories'),
};
const TEXT = {
  icon: TextIcon,
  Pane: TextPane,
  id: 'text',
  ariaLabel: __('Text', 'web-stories'),
};
const SHAPES = {
  icon: ShapesIcon,
  Pane: ShapesPane,
  id: 'shapes',
  ariaLabel: __('Shapes', 'web-stories'),
};
const ELEMS = {
  icon: ElementsIcon,
  Pane: ElementsPane,
  id: 'elements',
  ariaLabel: __('Elements', 'web-stories'),
};
const ANIM = {
  icon: AnimationIcon,
  Pane: AnimationPane,
  id: 'animation',
  ariaLabel: __('Animation', 'web-stories'),
};

function LibraryProvider({ children }) {
  const initialTab = MEDIA.id;
  const [tab, setTab] = useState(initialTab);
  const insertElement = useInsertElement();

  const { showAnimationTab, showElementsTab, media3pTab } = useFeatures();

  // Order here is important, as it denotes the actual visual order of elements.
  const tabs = useMemo(
    () => [
      MEDIA,
      ...(media3pTab ? [MEDIA3P] : []),
      TEXT,
      SHAPES,
      ...(showElementsTab ? [ELEMS] : []),
      ...(showAnimationTab ? [ANIM] : []),
    ],
    [media3pTab, showAnimationTab, showElementsTab]
  );

  const state = useMemo(
    () => ({
      state: {
        tab,
        initialTab,
      },
      actions: {
        setTab,
        insertElement,
      },
      data: {
        tabs: tabs,
      },
    }),
    [tab, insertElement, initialTab, tabs]
  );

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

LibraryProvider.propTypes = {
  children: PropTypes.node,
};

export default LibraryProvider;
