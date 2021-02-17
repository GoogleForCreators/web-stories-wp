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
import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { useFeatures } from 'flagged';
import { getTimeTracker } from '@web-stories-wp/tracking';
import { loadTextSets } from '@web-stories-wp/text-sets';
/**
 * Internal dependencies
 */
import { useInsertElement, useInsertTextSet } from '../canvas';
import Context from './context';
import { MediaPane, MediaIcon } from './panes/media/local';
import { Media3pPane, Media3pIcon } from './panes/media/media3p';
import { ShapesPane, ShapesIcon } from './panes/shapes';
import { TextPane, TextIcon } from './panes/text';
import { ElementsPane, ElementsIcon } from './panes/elements';
import { PageLayoutsPane, PageLayoutsIcon } from './panes/pageLayouts';

const MEDIA = { icon: MediaIcon, Pane: MediaPane, id: 'media' };
const MEDIA3P = { icon: Media3pIcon, Pane: Media3pPane, id: 'media3p' };
const TEXT = { icon: TextIcon, Pane: TextPane, id: 'text' };
const SHAPES = { icon: ShapesIcon, Pane: ShapesPane, id: 'shapes' };
const ELEMS = { icon: ElementsIcon, Pane: ElementsPane, id: 'elements' };
const PAGE_LAYOUTS = {
  icon: PageLayoutsIcon,
  Pane: PageLayoutsPane,
  id: 'pageLayouts',
};

function LibraryProvider({ children }) {
  const initialTab = MEDIA.id;
  const [tab, setTab] = useState(initialTab);
  const [textSets, setTextSets] = useState({});
  const renderedTabs = useRef({});
  const insertElement = useInsertElement();
  const { insertTextSet, insertTextSetByOffset } = useInsertTextSet();

  const { showElementsTab } = useFeatures();

  // Order here is important, as it denotes the actual visual order of elements.
  const tabs = useMemo(() => {
    return [
      MEDIA,
      MEDIA3P,
      TEXT,
      SHAPES,
      showElementsTab ? ELEMS : {},
      PAGE_LAYOUTS,
    ].reduce((accTabs, renderTab) => {
      // for heavier tab content, avoid rendering the pane unless it is active
      const isLazyTab = [MEDIA3P.id, TEXT.id, PAGE_LAYOUTS.id].includes(
        renderTab.id
      );
      const isActiveTab = tab === renderTab.id;
      const hasBeenRendered = renderedTabs.current[renderTab.id];

      return renderTab.id
        ? [
            ...accTabs,
            // remove the pane if it hasn't been rendered before or the tab is not active
            isLazyTab && !isActiveTab && !hasBeenRendered
              ? { id: renderTab.id, icon: renderTab.icon }
              : renderTab,
          ]
        : accTabs;
    }, []);
  }, [showElementsTab, tab]);

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
  const getTextSets = useCallback(async () => {
    const trackTiming = getTimeTracker('load_text_sets');
    setTextSets(await loadTextSets());
    trackTiming();
  }, []);

  useEffect(() => {
    // track the rendered tabs
    const previouslyRenderedTabs = { ...renderedTabs.current };
    renderedTabs.current = { ...previouslyRenderedTabs, [tab]: true };

    // if text pane hasn't been rendered until now fetch dynamically imported text sets
    if (tab === TEXT.id && !previouslyRenderedTabs[tab]) {
      getTextSets();
    }
  }, [tab, getTextSets]);

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

LibraryProvider.propTypes = {
  children: PropTypes.node,
};

export default LibraryProvider;
