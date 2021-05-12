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
import { getTimeTracker, trackEvent } from '@web-stories-wp/tracking';
import { loadTextSets } from '@web-stories-wp/text-sets';

/**
 * Internal dependencies
 */
import { useInsertElement, useInsertTextSet } from '../canvas';
import { useHighlights } from '../../app/highlights';
import Context from './context';
import { getPaneId, Pane as SharedPane } from './panes/shared';
import {
  ELEMS,
  LAZY_TABS,
  MEDIA,
  MEDIA3P,
  PAGE_TEMPLATES,
  SHAPES,
  TEXT,
} from './constants';

const LIBRARY_TAB_IDS = new Set(
  [ELEMS, LAZY_TABS, MEDIA, MEDIA3P, PAGE_TEMPLATES, SHAPES, TEXT].map(
    (tab) => tab.id
  )
);

function LibraryProvider({ children }) {
  const [tab, setTab] = useState(MEDIA.id);
  const [textSets, setTextSets] = useState({});
  const [savedTemplates, setSavedTemplates] = useState(null);
  const renderedTabs = useRef({});
  const insertElement = useInsertElement();
  const { insertTextSet, insertTextSetByOffset } = useInsertTextSet();

  const { showElementsTab } = useFeatures();

  const renderEmptyPane = useCallback((id) => {
    const EmptyPane = (props) => <SharedPane id={getPaneId(id)} {...props} />;
    return EmptyPane;
  }, []);

  const { highlightedTab } = useHighlights(({ tab: highlightedTab }) => ({
    highlightedTab,
  }));

  useEffect(() => {
    if (highlightedTab && LIBRARY_TAB_IDS.has(highlightedTab)) {
      setTab(highlightedTab);
      trackEvent('quick_action_tab_change', {
        name: highlightedTab,
      });
    }
  }, [highlightedTab]);

  const tabs = useMemo(
    // Order here is important, as it denotes the actual visual order of elements.
    () =>
      [MEDIA, MEDIA3P, TEXT, SHAPES, showElementsTab && ELEMS, PAGE_TEMPLATES]
        .filter(Boolean)
        .map(({ Pane, id, ...rest }) => {
          const isLazyTab = LAZY_TABS.includes(id);
          const isActiveTab = tab === id;
          const hasBeenRendered = renderedTabs.current[id];
          const shouldRenderPane = !isLazyTab || isActiveTab || hasBeenRendered;
          return {
            id,
            Pane: shouldRenderPane ? Pane : renderEmptyPane(id),
            ...rest,
          };
        }),
    [tab, showElementsTab, renderEmptyPane]
  );

  const state = useMemo(
    () => ({
      state: {
        tab,
        textSets,
        savedTemplates,
      },
      actions: {
        setTab,
        insertElement,
        insertTextSet,
        insertTextSetByOffset,
        setSavedTemplates,
      },
      data: {
        tabs: tabs,
      },
    }),
    [
      tab,
      textSets,
      savedTemplates,
      insertElement,
      insertTextSet,
      insertTextSetByOffset,
      tabs,
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
