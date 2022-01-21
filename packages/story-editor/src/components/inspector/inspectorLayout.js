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
import { useCallback } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { trackEvent } from '@googleforcreators/tracking';
import { useEscapeToBlurEffect } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
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

const UnjustifiedTabView = styled(TabView)`
  justify-content: center;
`;

function InspectorLayout() {
  const {
    state: { tab, tabRefs },
    actions: { setInspectorContentNode, setTab },
    refs: { inspector },
    data: { tabs },
  } = useInspector();

  const onTabChange = useCallback(
    (id) => {
      setTab(id);
      trackEvent('inspector_tab_change', {
        name: id,
      });
    },
    [setTab]
  );

  useEscapeToBlurEffect(inspector);
  return (
    <Layout ref={inspector}>
      <UnjustifiedTabView
        label={__('Inspector Selection', 'web-stories')}
        tabs={tabs}
        tab={tab}
        tabRefs={tabRefs}
        onTabChange={onTabChange}
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
