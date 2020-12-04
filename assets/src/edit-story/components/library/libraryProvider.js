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
import { useEffect, useMemo, useState } from 'react';
import { useFeatures } from 'flagged';

/**
 * Internal dependencies
 */
import { useInsertElement, useInsertTextSet } from '../canvas';
import Context from './context';
import { AnimationPane, AnimationIcon } from './panes/animation';
import { MediaPane, MediaIcon } from './panes/media/local';
import { Media3pPane, Media3pIcon } from './panes/media/media3p';
import { ShapesPane, ShapesIcon } from './panes/shapes';
import { TextPane, TextIcon } from './panes/text';
import { ElementsPane, ElementsIcon } from './panes/elements';
import { PageLayoutsPane, PageLayoutsIcon } from './panes/pageLayouts';
import { getTextSets } from './panes/text/textSets/utils';

const MEDIA = { icon: MediaIcon, Pane: MediaPane, id: 'media' };
const MEDIA3P = { icon: Media3pIcon, Pane: Media3pPane, id: 'media3p' };
const TEXT = { icon: TextIcon, Pane: TextPane, id: 'text' };
const SHAPES = { icon: ShapesIcon, Pane: ShapesPane, id: 'shapes' };
const ELEMS = { icon: ElementsIcon, Pane: ElementsPane, id: 'elements' };
const ANIM = { icon: AnimationIcon, Pane: AnimationPane, id: 'animation' };
const PAGE_LAYOUTS = {
  icon: PageLayoutsIcon,
  Pane: PageLayoutsPane,
  id: 'pageLayouts',
};

function LibraryProvider({ children }) {
  const initialTab = MEDIA.id;
  const [tab, setTab] = useState(initialTab);
  const [textSets, setTextSets] = useState({});
  const insertElement = useInsertElement();
  const { insertTextSet, insertTextSetByOffset } = useInsertTextSet();

  const {
    showAnimationTab,
    showElementsTab,
    showPageLayoutsTab,
  } = useFeatures();

  // Order here is important, as it denotes the actual visual order of elements.
  const tabs = useMemo(
    () => [
      MEDIA,
      MEDIA3P,
      ...(tab === TEXT.id ? [TEXT] : [{ icon: TextIcon, id: 'text' }]),
      SHAPES,
      ...(showElementsTab ? [ELEMS] : []),
      ...(showAnimationTab ? [ANIM] : []),
      ...(showPageLayoutsTab ? [PAGE_LAYOUTS] : []),
    ],
    [showAnimationTab, showElementsTab, showPageLayoutsTab, tab]
  );

  const state = useMemo(
    () => ({
      state: {
        tab,
        initialTab,
        textSets,
      },
      actions: {
        setTab,
        insertElement,
        insertTextSet,
        insertTextSetByOffset,
      },
      data: {
        tabs: tabs,
      },
    }),
    [
      tab,
      insertElement,
      insertTextSet,
      insertTextSetByOffset,
      initialTab,
      tabs,
      textSets,
    ]
  );

  useEffect(() => {
    getTextSets().then(setTextSets);
  }, []);

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

LibraryProvider.propTypes = {
  children: PropTypes.node,
};

export default LibraryProvider;
