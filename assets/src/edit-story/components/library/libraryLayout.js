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
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';
import { useCallback } from 'react';
import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import TabView from '../tabview';
import { states, styles, useFocusHighlight } from '../../app/highlights';
import LibraryPanes from './libraryPanes';
import useLibrary from './useLibrary';
import { getTabId, getPaneId } from './panes/shared';
import { MEDIA, TEXT } from './constants';

const Layout = styled.section.attrs({
  'aria-label': __('Library', 'web-stories'),
  'data-testid': 'libraryLayout',
})`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  color: ${({ theme }) => theme.colors.fg.primary};
  max-height: 100%;
`;

// @todo Verify that L10N works with the translation happening here.
const TabsArea = styled.nav.attrs({
  'aria-label': __('Library tabs', 'web-stories'),
})`
  padding: 0 4px;
`;

const LibraryPaneContainer = styled.div`
  height: 100%;
  min-height: 0;
`;

function LibraryLayout() {
  const { setTab, tab, tabRefs, tabs } = useLibrary((state) => ({
    tab: state.state.tab,
    tabRefs: state.state.tabRefs,
    setTab: state.actions.setTab,
    tabs: state.data.tabs,
  }));

  const mediaHighlight = useFocusHighlight(states.MEDIA, tabRefs[MEDIA.id]);
  const textHighlight = useFocusHighlight(states.TEXT, tabRefs[TEXT.id]);

  const onTabChange = useCallback(
    (id) => {
      setTab(id);
      trackEvent('library_tab_change', {
        name: id,
      });
    },
    [setTab]
  );

  return (
    <Layout>
      <TabsArea>
        <TabView
          label={__('Element Library Selection', 'web-stories')}
          tabs={tabs}
          tabRefs={tabRefs}
          tab={tab}
          onTabChange={onTabChange}
          getTabId={getTabId}
          getAriaControlsId={getPaneId}
          shortcut="mod+option+1"
        />
      </TabsArea>
      <LibraryPaneContainer>
        <LibraryPanes
          mediaPaneStyles={mediaHighlight?.showEffect && styles.FLASH}
          textPaneStyles={textHighlight?.showEffect && styles.FLASH}
        />
      </LibraryPaneContainer>
    </Layout>
  );
}

export default LibraryLayout;
