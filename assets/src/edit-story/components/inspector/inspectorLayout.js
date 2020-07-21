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
import { useEscapeToBlurEffect } from '../keyboard';
import { withScrollbarStyle } from '../../theme';
import useObtrusiveScrollbars from '../../utils/useObtrusiveScrollbars';
import useInspector from './useInspector';
import InspectorTabs from './inspectorTabs';
import InspectorContent from './inspectorContent';

const Layout = styled.section.attrs({
  'aria-label': __('Inspector', 'web-stories'),
})`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TabsArea = styled.div``;

const InspectorBackground = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.v4};
  height: 100%;
  padding: 0;
  color: ${({ theme }) => theme.colors.fg.v1};
  ${withScrollbarStyle}
`;

function InspectorLayout() {
  const {
    actions: { setInspectorContentNode },
    refs: { inspector },
  } = useInspector();
  const hasObtrusiveScrollbars = useObtrusiveScrollbars();
  useEscapeToBlurEffect(inspector);
  return (
    <Layout ref={inspector}>
      <TabsArea>
        <InspectorTabs />
      </TabsArea>
      <InspectorBackground
        ref={setInspectorContentNode}
        hasObtrusiveScrollbars={hasObtrusiveScrollbars}
      >
        <InspectorContent />
      </InspectorBackground>
    </Layout>
  );
}

export default InspectorLayout;
