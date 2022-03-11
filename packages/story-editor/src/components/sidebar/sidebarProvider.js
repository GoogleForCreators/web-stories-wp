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
/**
 * Internal dependencies
 */
import { useAPI } from '../../app/api';
import { useStory } from '../../app/story';
import { states, useHighlights } from '../../app/highlights';
import Library from '../library';
import DesignInspector from '../design';
import { DOCUMENT, STYLE, PUBLISH_MODAL_DOCUMENT, INSERT } from './constants';
import Context from './context';

const SIDEBAR_TAB_IDS = new Set([INSERT, DOCUMENT, STYLE]);
function SidebarProvider({ sidebarTabs, children }) {
  const {
    actions: { getAuthors },
  } = useAPI();
  const { selectedElementIds, currentPage } = useStory(({ state }) => ({
    selectedElementIds: state.selectedElementIds,
    currentPage: state.currentPage,
  }));

  const { tab: highlightedTab, highlight } = useHighlights((state) => ({
    tab: state.tab,
    highlight: state[states.STYLE_PANE],
  }));

  // set tab when content is highlighted
  useEffect(() => {
    if (SIDEBAR_TAB_IDS.has(highlightedTab)) {
      setTab(highlightedTab);
      trackEvent('quick_action_tab_change', {
        name: highlightedTab,
      });
    }
  }, [highlightedTab]);

  const sidebarRef = useRef(null);

  const [tab, setTab] = useState(INSERT);
  const [users, setUsers] = useState([]);
  const [sidebarContentHeight, setSidebarContentHeight] = useState(null);
  const sidebarContentRef = useRef();
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

  const setSidebarContentNode = useCallback((node) => {
    sidebarContentRef.current = node;
  }, []);

  useResizeEffect(
    sidebarContentRef,
    ({ height }) => setSidebarContentHeight(height),
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

  // focus design pane when highlighted
  useEffect(() => {
    const node = designPaneRef.current;
    if (node && highlight?.focus && highlight?.showEffect) {
      node.focus();
    }
  }, [highlight]);

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
      sidebarContentHeight,
      isUsersLoading,
    },
    refs: {
      sidebar: sidebarRef,
    },
    actions: {
      setTab,
      loadUsers,
      setSidebarContentNode,
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

  if (sidebarTabs?.document) {
    state.data.tabs.push({
      id: DOCUMENT,
      ...sidebarTabs.document,
    });
  }

  if (sidebarTabs?.publishModal) {
    state.data.modalSidebarTab = {
      id: PUBLISH_MODAL_DOCUMENT,
      ...sidebarTabs.publishModal,
    };
  }

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

SidebarProvider.propTypes = {
  children: PropTypes.node,
  sidebarTabs: PropTypes.object,
};

export default SidebarProvider;
