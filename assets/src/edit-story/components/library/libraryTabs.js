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
import { useMemo, useRef, useCallback } from 'react';

/**
 * Internal dependencies
 */
import { useConfig } from '../../app';
import { useKeyDownEffect } from '../keyboard';
import useLibrary from './useLibrary';
import { Tabs, getPanes } from './panes';
import { getTabId } from './panes/shared';

function LibraryTabs() {
  const { tab, setTab, tabs } = useLibrary((state) => ({
    tab: state.state.tab,
    setTab: state.actions.setTab,
    tabs: state.data.tabs,
  }));
  const { isRTL } = useConfig();
  const panes = useMemo(() => getPanes(tabs), [tabs]);
  const ref = useRef();
  const handleNavigation = useCallback(
    (direction) => () => {
      const currentIndex = panes.findIndex(({ id }) => id === tab);
      const nextPane = panes[currentIndex + direction];
      if (!nextPane) {
        return;
      }

      setTab(nextPane.id);
      const tabId = getTabId(nextPane.id);
      ref.current.querySelector(`#${tabId}`).focus();
    },
    [tab, setTab, panes]
  );

  const backwardDirection = isRTL ? 1 : -1;
  const forwardDirection = isRTL ? -1 : 1;

  useKeyDownEffect(ref, 'left', handleNavigation(backwardDirection), [
    handleNavigation,
  ]);
  useKeyDownEffect(ref, 'right', handleNavigation(forwardDirection), [
    handleNavigation,
  ]);

  return (
    <Tabs ref={ref}>
      {panes.map(({ id, Tab }) => (
        <Tab
          key={id}
          id={getTabId(id)}
          isActive={tab === id}
          onClick={() => setTab(id)}
        />
      ))}
    </Tabs>
  );
}

export default LibraryTabs;
