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
 * Internal dependencies
 */
import useInspector from './useInspector';
import DesignInspector from './designInspector';
import DocumentInspector from './documentInspector';
import PrepublishInspector from './prepublishInspector';
import { getTabId } from './shared';

const InspectorWrapper = styled.div.attrs({ tabIndex: '0', role: 'tabpanel' })``;
const InspectorForm = styled.form`
  display: flex;
  flex-direction: column;
`;

function Inspector() {
  const {
    state: { tab },
    data: { tabs: { DESIGN, DOCUMENT, PREPUBLISH } },
  } = useInspector();

  const ContentInspector = ({
    [DESIGN]: DesignInspector,
    [DOCUMENT]: DocumentInspector,
    [PREPUBLISH]: PrepublishInspector,
  })[tab];

  return (
    <InspectorWrapper aria-labelledby={tab} id={getTabId(tab)}>
      <InspectorForm>
        <ContentInspector />
      </InspectorForm>
    </InspectorWrapper>
  );
}

export default Inspector;
