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

/**
 * Internal dependencies
 */
import { useEscapeToBlurEffect } from '../../../design-system';
import TabView from '../tabview';
import useInspector from './useInspector';
import InspectorContent from './inspectorContent';
import { getTabId } from './utils';

const Layout = styled.section.attrs({
  'aria-label': __('Inspector', 'web-stories'),
})`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

const InspectorContainer = styled.div`
  height: 100%;
  padding: 0;
  overflow: auto;
`;

function InspectorLayout() {
  const {
    state: { tab },
    actions: { setInspectorContentNode, setTab },
    refs: { inspector },
    data: { tabs },
  } = useInspector();
  useEscapeToBlurEffect(inspector);
  return (
    <Layout ref={inspector}>
      <TabView
        label={__('Inspector Selection', 'web-stories')}
        tabs={tabs}
        initialTab={tab}
        onTabChange={(id) => setTab(id)}
        getAriaControlsId={getTabId}
        shortcut="mod+option+3"
      />
      <InspectorContainer ref={setInspectorContentNode}>
        <InspectorContent />
      </InspectorContainer>
    </Layout>
  );
}

export default InspectorLayout;
