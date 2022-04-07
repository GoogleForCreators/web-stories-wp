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
import {
  useEffect,
  useRef,
  useMemo,
  useState,
  useCallback,
} from '@googleforcreators/react';
import { useFeature } from 'flagged';
import { getTimeTracker, trackEvent } from '@googleforcreators/tracking';
import { loadTextSets } from '@googleforcreators/text-sets';
import { uniqueEntriesByKey } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useInsertElement, useInsertTextSet } from '../canvas';
import { useHighlights } from '../../app/highlights';
import { useConfig, useAPI } from '../../app';
import Context from './context';
import {
  ELEMS,
  MEDIA,
  MEDIA3P,
  PAGE_TEMPLATES,
  SHAPES,
  TEXT,
  SHOPPING,
} from './constants';

const LIBRARY_TAB_IDS = new Set(
  [ELEMS, MEDIA, MEDIA3P, PAGE_TEMPLATES, SHAPES, TEXT, SHOPPING].map(
    (tab) => tab.id
  )
);

function LibraryProvider({ children }) {
  const { showMedia3p, canViewDefaultTemplates } = useConfig();
  const {
    actions: { getMedia, getCustomPageTemplates },
  } = useAPI();
  const isShoppingEnabled = useFeature('shoppingIntegration');
  const showElementsTab = useFeature('showElementsTab');

  const supportsCustomTemplates = Boolean(getCustomPageTemplates);
  const showPageTemplates = canViewDefaultTemplates || supportsCustomTemplates;

  const showMedia = Boolean(getMedia); // Do not show media tab if getMedia api callback is not provided.
  const [textSets, setTextSets] = useState({});
  const [areTextSetsLoading, setAreTextSetsLoading] = useState({});
  const [savedTemplates, _setSavedTemplates] = useState(null);

  // The first page of templates to fetch is 1.
  const [nextTemplatesToFetch, setNextTemplatesToFetch] = useState(1);
  // If to use smart colors with text and text sets.
  const [shouldUseSmartColor, setShouldUseSmartColor] = useState(false);

  const setSavedTemplates = useCallback(
    (t) =>
      _setSavedTemplates((_savedTemplates) =>
        uniqueEntriesByKey(
          typeof t === 'function' ? t(_savedTemplates) : t,
          'templateId'
        )
      ),
    []
  );

  const updateSavedTemplate = useCallback((template) => {
    _setSavedTemplates((_savedTemplates) => {
      return _savedTemplates.map((t) => {
        if (t.templateId === template.templateId) {
          return {
            ...t,
            ...template,
          };
        }
        return t;
      });
    });
  }, []);

  const tabs = useMemo(
    // Order here is important, as it denotes the actual visual order of elements.
    () =>
      [
        showMedia && MEDIA,
        showMedia3p && MEDIA3P,
        TEXT,
        SHAPES,
        showElementsTab && ELEMS,
        isShoppingEnabled && SHOPPING,
        showPageTemplates && PAGE_TEMPLATES,
      ].filter(Boolean),
    [
      showMedia3p,
      showElementsTab,
      showMedia,
      showPageTemplates,
      isShoppingEnabled,
    ]
  );

  const [tab, setTab] = useState(tabs[0].id);

  const insertElement = useInsertElement();
  const { insertTextSet, insertTextSetByOffset } =
    useInsertTextSet(shouldUseSmartColor);

  const { highlightedTab } = useHighlights(({ section: highlightedTab }) => ({
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
  const shoppingRef = useRef(null);

  const tabRefs = useMemo(
    () => ({
      [MEDIA.id]: mediaTabRef,
      [MEDIA3P.id]: media3pTabRef,
      [TEXT.id]: textTabRef,
      [SHAPES.id]: shapesTabRef,
      [ELEMS.id]: elementsTabRef,
      [PAGE_TEMPLATES.id]: pageTemplatesTabRef,
      [SHOPPING.id]: shoppingRef,
    }),
    []
  );

  const state = useMemo(
    () => ({
      state: {
        areTextSetsLoading,
        tab,
        tabRefs,
        textSets,
        savedTemplates,
        nextTemplatesToFetch,
        shouldUseSmartColor,
      },
      actions: {
        setTab,
        insertElement,
        insertTextSet,
        insertTextSetByOffset,
        setSavedTemplates,
        updateSavedTemplate,
        setNextTemplatesToFetch,
        setShouldUseSmartColor,
      },
      data: {
        tabs: tabs,
      },
    }),
    [
      areTextSetsLoading,
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
      shouldUseSmartColor,
      setSavedTemplates,
      updateSavedTemplate,
    ]
  );
  useEffect(() => {
    let mounted = true;

    async function getTextSets() {
      const trackTiming = getTimeTracker('load_text_sets');
      setAreTextSetsLoading(true);
      const newTextSets = await loadTextSets();
      trackTiming();

      if (!mounted) {
        return;
      }

      setTextSets(newTextSets);
      setAreTextSetsLoading(false);
    }

    // if text sets have not been loaded but are needed fetch dynamically imported text sets
    if (tab === TEXT.id && !Object.keys(textSets).length) {
      getTextSets();
    }

    return () => {
      mounted = false;
    };
  }, [tab, textSets]);

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

LibraryProvider.propTypes = {
  children: PropTypes.node,
};

export default LibraryProvider;
