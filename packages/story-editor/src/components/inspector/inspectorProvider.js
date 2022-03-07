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
  useCallback,
  useState,
  useRef,
  useEffect,
  useMemo,
  useResizeEffect,
} from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { trackEvent } from '@googleforcreators/tracking';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import { useAPI } from '../../app/api';
import { useStory } from '../../app/story';
import { useHighlights } from '../../app/highlights';
import Library from '../library';
import { DOCUMENT, STYLE, PUBLISH_MODAL_DOCUMENT, INSERT } from './constants';
import Context from './context';
import DesignInspector from './design';

const INSPECTOR_TAB_IDS = new Set([INSERT, DOCUMENT, STYLE]);
function InspectorProvider({ inspectorTabs, children }) {
  const isUpdatedPublishModalEnabled = useFeature(
    'enableUpdatedPublishStoryModal'
  );

  const {
    actions: { getAuthors },
  } = useAPI();
  const { selectedElementIds, currentPage } = useStory(({ state }) => ({
    selectedElementIds: state.selectedElementIds,
    currentPage: state.currentPage,
  }));

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

  const [tab, setTab] = useState(INSERT);
  const [users, setUsers] = useState([]);
  const [inspectorContentHeight, setInspectorContentHeight] = useState(null);
  const inspectorContentRef = useRef();
  const tabRef = useRef(tab);

  const insertPaneRef = useRef(null);
  const designPaneRef = useRef(null);
  const documentPaneRef = useRef(null);

  const tabRefs = useMemo(
    () => ({
      [INSERT]: insertPaneRef,
      [STYLE]: designPaneRef,
      [DOCUMENT]: documentPaneRef,
    }),
    []
  );

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
    if (selectedElementIds.length > 0 && tabRef.current === DOCUMENT) {
      setTab(STYLE);
    }
  }, [selectedElementIds]);

  useEffect(() => {
    if (tabRef.current === DOCUMENT) {
      setTab(STYLE);
    }
  }, [currentPage]);

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
          id: INSERT,
          title: __('Insert', 'web-stories'),
          Pane: Library,
        },
        {
          id: STYLE,
          title: __('Style', 'web-stories'),
          Pane: DesignInspector,
        },
      ],
    },
  };

  if (inspectorTabs?.document) {
    state.data.tabs.push({
      id: DOCUMENT,
      ...inspectorTabs.document,
    });
  }

  if (inspectorTabs?.publishModal && isUpdatedPublishModalEnabled) {
    state.data.modalInspectorTab = {
      id: PUBLISH_MODAL_DOCUMENT,
      ...inspectorTabs.publishModal,
    };
  }

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

InspectorProvider.propTypes = {
  children: PropTypes.node,
  inspectorTabs: PropTypes.object,
};

export default InspectorProvider;
