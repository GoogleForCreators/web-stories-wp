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
import { useState, useRef, useEffect, useMemo } from '@googleforcreators/react';
import { Icons } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useStory } from '../../app/story';
import { useHighlights } from '../../app/highlights';
import { SELECTION, LINK, ANIMATION } from './constants';
import Context from './context';

const STYLE_TAB_IDS = new Set([SELECTION.id, LINK.id, ANIMATION.id]);

function StyleProvider({ children }) {
  const { selectedElements } = useStory(({ state }) => ({
    selectedElements: state.selectedElements,
  }));

  const { tab: highlightedTab } = useHighlights((state) => ({
    tab: state.section,
  }));

  // set tab when content is highlighted
  useEffect(() => {
    if (STYLE_TAB_IDS.has(highlightedTab)) {
      setTab(highlightedTab);
    }
  }, [highlightedTab]);

  const styleRef = useRef(null);
  const [tab, setTab] = useState(SELECTION.id);
  const selectionPaneRef = useRef(null);
  const linkPaneRef = useRef(null);
  const animationPaneRef = useRef(null);

  const tabRefs = useMemo(
    () => ({
      [SELECTION.id]: selectionPaneRef,
      [LINK.id]: linkPaneRef,
      [ANIMATION.id]: animationPaneRef,
    }),
    []
  );

  let selectionIcon = Icons.Dots;
  const icons = [...new Set(selectedElements.map(({ type }) => type))];
  if (icons.length === 1) {
    if (icons[0] === 'text') {
      selectionIcon = Icons.LetterT;
    }
    if (icons[0] === 'image' || selectedElements[0].isBackground) {
      selectionIcon = Icons.Picture;
    }
    if (icons[0] === 'video') {
      selectionIcon = Icons.Video;
    }
    if (icons[0] === 'shape' || icons[0] === 'sticker') {
      selectionIcon = Icons.Shapes;
    }
  } else {
    selectionIcon = Icons.Dots;
  }

  const state = {
    state: {
      tab,
    },
    refs: {
      styleRef,
      tabRefs,
    },
    actions: {
      setTab,
    },
    data: {
      tabs: [{ ...SELECTION, icon: selectionIcon }],
    },
  };

  const isBackgroundSelected =
    selectedElements[0]?.isBackground ||
    selectedElements[0]?.isDefaultBackground;
  if (!isBackgroundSelected) {
    state.data.tabs.push(LINK);
  }
  if (!selectedElements[0]?.isDefaultBackground) {
    state.data.tabs.push(ANIMATION);
  }

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

StyleProvider.propTypes = {
  children: PropTypes.node,
};

export default StyleProvider;
