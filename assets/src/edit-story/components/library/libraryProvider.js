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
import { useEffect, useRef, useMemo, useState } from 'react';
import { useFeatures } from 'flagged';
import { getTimeTracker, trackEvent } from '@web-stories-wp/tracking';
import { loadTextSets } from '@web-stories-wp/text-sets';

/**
 * Internal dependencies
 */
import { useInsertElement, useInsertTextSet } from '../canvas';
import { useHighlights } from '../../app/highlights';
import Context from './context';
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
  [ELEMS, MEDIA, MEDIA3P, PAGE_TEMPLATES, SHAPES, TEXT]
    .map((tab) => tab.id)
    .concat(LAZY_TABS)
);

function LibraryProvider({ children }) {
  const [tab, setTab] = useState(MEDIA.id);
  const [textSets, setTextSets] = useState({});
  const [savedTemplates, setSavedTemplates] = useState(null);
  // The first page of templates to fetch is 1.
  const [nextTemplatesToFetch, setNextTemplatesToFetch] = useState(1);
  const [pageCanvasData, setPageCanvasData] = useState(null);
  const [pageCanvasPromise, setPageCanvasPromise] = useState(null);

  const insertElement = useInsertElement();
  const { insertTextSet, insertTextSetByOffset } = useInsertTextSet();

  const { showElementsTab } = useFeatures();

  const { highlightedTab } = useHighlights(({ tab: highlightedTab }) => ({
    highlightedTab,
  }));

  useEffect(() => {
    if (LIBRARY_TAB_IDS.has(highlightedTab)) {
      setTab(highlightedTab);
      trackEvent('quick_action_tab_change', {
        name: highlightedTab,
      });
    }
  }, [highlightedTab]);

  const mediaTabRef = useRef(null);
  const media3pTabRef = useRef(null);
  const textTabRef = useRef(null);
  const shapesTabRef = useRef(null);
  const elementsTabRef = useRef(null);
  const pageTemplatesTabRef = useRef(null);

  const tabRefs = useMemo(
    () => ({
      [MEDIA.id]: mediaTabRef,
      [MEDIA3P.id]: media3pTabRef,
      [TEXT.id]: textTabRef,
      [SHAPES.id]: shapesTabRef,
      [ELEMS.id]: elementsTabRef,
      [PAGE_TEMPLATES.id]: pageTemplatesTabRef,
    }),
    []
  );

  const tabs = useMemo(
    // Order here is important, as it denotes the actual visual order of elements.
    () =>
      [
        MEDIA,
        MEDIA3P,
        TEXT,
        SHAPES,
        showElementsTab && ELEMS,
        PAGE_TEMPLATES,
      ].filter(Boolean),
    [showElementsTab]
  );

  const state = useMemo(
    () => ({
      state: {
        pageCanvasData,
        tab,
        tabRefs,
        textSets,
        savedTemplates,
        nextTemplatesToFetch,
        pageCanvasPromise,
      },
      actions: {
        setPageCanvasData,
        setTab,
        insertElement,
        insertTextSet,
        insertTextSetByOffset,
        setSavedTemplates,
        setNextTemplatesToFetch,
        setPageCanvasPromise,
      },
      data: {
        tabs: tabs,
      },
    }),
    [
      tab,
      tabRefs,
      textSets,
      savedTemplates,
      insertElement,
      insertTextSet,
      insertTextSetByOffset,
      tabs,
      nextTemplatesToFetch,
      setNextTemplatesToFetch,
      pageCanvasData,
      pageCanvasPromise,
      setPageCanvasPromise,
    ]
  );
  useEffect(() => {
    async function getTextSets() {
      const trackTiming = getTimeTracker('load_text_sets');
      setTextSets(await loadTextSets());
      trackTiming();
    }
    // if text sets have not been loaded but are needed fetch dynamically imported text sets
    if (tab === TEXT.id && !Object.keys(textSets).length) {
      getTextSets();
    }
  }, [tab, textSets]);

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

LibraryProvider.propTypes = {
  children: PropTypes.node,
};

export default LibraryProvider;
