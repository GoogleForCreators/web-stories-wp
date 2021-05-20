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
import { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import { useDebouncedCallback } from 'use-debounce/lib';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { trackEvent } from '@web-stories-wp/tracking';
import { useResizeEffect } from '../../../design-system';
import { useAPI } from '../../app/api';
import { useStory } from '../../app/story';

import { useHighlights } from '../../app/highlights';
import { DOCUMENT, DESIGN, PREPUBLISH } from './constants';
import PrepublishInspector, {
  usePrepublishChecklist,
  ChecklistIcon,
} from './prepublish';
import Context from './context';
import DesignInspector from './design';
import DocumentInspector from './document';

const INSPECTOR_TAB_IDS = new Set([DOCUMENT, DESIGN, PREPUBLISH]);
function InspectorProvider({ children }) {
  const {
    actions: { getAuthors },
  } = useAPI();
  const { selectedElementIds, currentPage } = useStory(({ state }) => ({
    selectedElementIds: state.selectedElementIds,
    currentPage: state.currentPage,
  }));

  const { currentCheckpoint, isChecklistReviewRequested, refreshChecklist } =
    usePrepublishChecklist();

  const [refreshChecklistDebounced] = useDebouncedCallback(
    refreshChecklist,
    500
  );

  const { tab: highlightedTab } = useHighlights(({ tab }) => ({ tab }));

  useEffect(() => {
    if (INSPECTOR_TAB_IDS.has(highlightedTab)) {
      setTab(highlightedTab);
      trackEvent('quick_action_tab_change', {
        name: highlightedTab,
      });
    }
  }, [highlightedTab]);

  const inspectorRef = useRef(null);

  const [tab, setTab] = useState(DESIGN);
  const [users, setUsers] = useState([]);
  const [inspectorContentHeight, setInspectorContentHeight] = useState(null);
  const inspectorContentRef = useRef();
  const tabRef = useRef(tab);
  const firstPublishAttemptRef = useRef(false);

  const designPaneRef = useRef(null);
  const documentPaneRef = useRef(null);
  const prepublishPaneRef = useRef(null);

  const tabRefs = useMemo(
    () => ({
      [DESIGN]: designPaneRef,
      [DOCUMENT]: documentPaneRef,
      [PREPUBLISH]: prepublishPaneRef,
    }),
    []
  );

  useEffect(() => {
    // If a user wants to review their checklist before publishing
    // a story that has high priority checklist items in it
    // we need to go to the checklist tab and focus it.
    // Because of how context is wrapped around the header
    // we need to do this by watching the isChecklistReviewRequested value
    // from the prepublishChecklistProvider.
    if (isChecklistReviewRequested && !firstPublishAttemptRef.current) {
      setTab(PREPUBLISH);
      // Focus prepublish which is the last item in the panel title list
      inspectorRef.current?.firstChild?.lastChild?.focus();
      firstPublishAttemptRef.current = isChecklistReviewRequested;
    }
    // If a published story that gets reverted to a draft and
    // it has high priority checklist items in it we should update
    // this ref so that the checklist panel focuses again.
    else if (!isChecklistReviewRequested && firstPublishAttemptRef.current) {
      firstPublishAttemptRef.current = false;
    }
  }, [isChecklistReviewRequested]);

  const [isUsersLoading, setIsUsersLoading] = useState(false);

  const setInspectorContentNode = useCallback((node) => {
    inspectorContentRef.current = node;
  }, []);

  useResizeEffect(
    inspectorContentRef,
    ({ height }) => setInspectorContentHeight(height),
    []
  );

  useEffect(() => {
    tabRef.current = tab;
    if (tab === PREPUBLISH) {
      refreshChecklistDebounced();
    }
  }, [tab, refreshChecklistDebounced, refreshChecklist]);

  useEffect(() => {
    if (selectedElementIds.length > 0 && tabRef.current === DOCUMENT) {
      setTab(DESIGN);
    }
  }, [selectedElementIds]);

  useEffect(() => {
    if (tabRef.current === DOCUMENT) {
      setTab(DESIGN);
    }
  }, [currentPage]);

  const ChecklistTabIcon = useCallback(
    () => <ChecklistIcon checkpoint={currentCheckpoint} className="alert" />,
    [currentCheckpoint]
  );

  const loadUsers = useCallback(() => {
    if (!isUsersLoading && users.length === 0) {
      setIsUsersLoading(true);
      getAuthors()
        .then((data) => {
          const saveData = data.map(({ id, name }) => ({
            id,
            name,
          }));
          setUsers(saveData);
        })
        .finally(() => {
          setIsUsersLoading(false);
        });
    }
  }, [isUsersLoading, users.length, getAuthors]);

  const state = {
    state: {
      tab,
      tabRefs,
      users,
      inspectorContentHeight,
      isUsersLoading,
    },
    refs: {
      inspector: inspectorRef,
    },
    actions: {
      setTab,
      loadUsers,
      setInspectorContentNode,
    },
    data: {
      tabs: [
        {
          id: DESIGN,
          title: __('Design', 'web-stories'),
          Pane: DesignInspector,
        },
        {
          id: DOCUMENT,
          title: __('Document', 'web-stories'),
          Pane: DocumentInspector,
        },

        {
          icon: ChecklistTabIcon,
          id: PREPUBLISH,
          title: __('Checklist', 'web-stories'),
          Pane: PrepublishInspector,
        },
      ],
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

InspectorProvider.propTypes = {
  children: PropTypes.node,
};

export default InspectorProvider;
