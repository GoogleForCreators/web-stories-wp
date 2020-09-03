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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TabView from '../tabview';
import LibraryPanes from './libraryPanes';
import useLibrary from './useLibrary';
import { getTabId } from './panes/shared';

const Layout = styled.section.attrs({
  'aria-label': __('Library', 'web-stories'),
  'data-testid': 'libraryLayout',
})`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.bg.panel};
  color: ${({ theme }) => theme.colors.fg.white};
  max-height: 100%;
`;

// @todo Verify that L10N works with the translation happening here.
const TabsArea = styled.nav.attrs({
  'aria-label': __('Library tabs', 'web-stories'),
})``;

const LibraryPaneContainer = styled.div`
  height: 100%;
  min-height: 0;
`;

function LibraryLayout() {
  const { initialTab, setTab, tabs } = useLibrary((state) => ({
    initialTab: state.state.initialTab,
    setTab: state.actions.setTab,
    tabs: state.data.tabs,
  }));

  return (
    <Layout>
      <TabsArea>
        <TabView
          label={__('Element Library Selection', 'web-stories')}
          tabs={tabs}
          initialTab={initialTab}
          onTabChange={(id) => setTab(id)}
          getTabId={getTabId}
        />
      </TabsArea>
      <LibraryPaneContainer>
        <LibraryPanes />
      </LibraryPaneContainer>
    </Layout>
  );
}

export default LibraryLayout;
