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
import { HEADER_HEIGHT } from '../../constants';
import LibraryPanes from './libraryPanes';
import LibraryTabs from './libraryTabs';

const Layout = styled.div`
  height: 100%;
  display: grid;
  grid:
    'tabs   ' ${HEADER_HEIGHT}px
    'library' 1fr
    / 1fr;
`;

// @todo Verify that L10N works with the translation happening here.
const TabsArea = styled.nav.attrs({
  'aria-label': __('Library tabs', 'web-stories'),
})`
  grid-area: tabs;
`;

const LibraryBackground = styled.div`
  grid-area: library;
  background-color: ${({ theme }) => theme.colors.bg.v4};
  color: ${({ theme }) => theme.colors.fg.v1};
  overflow: auto;
`;

function LibraryLayout() {
  return (
    <Layout data-testid="libraryLayout">
      <TabsArea>
        <LibraryTabs />
      </TabsArea>
      <LibraryBackground>
        <LibraryPanes />
      </LibraryBackground>
    </Layout>
  );
}

export default LibraryLayout;
