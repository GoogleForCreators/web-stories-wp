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
import { getTabId } from './utils';
import useInspector from './useInspector';

const Tabs = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.v4};
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: 100%;
  margin: 0;
`;

const Tab = styled.button.attrs({ role: 'tab' })`
  height: 100%;
  text-align: center;
  cursor: pointer;
  border: none;
  background: none;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.fg.v1};
  font-family: ${({ theme }) => theme.fonts.tab.family};
  font-size: ${({ theme }) => theme.fonts.tab.size};
  line-height: ${({ theme }) => theme.fonts.tab.lineHeight};
  font-weight: ${({ theme }) => theme.fonts.tab.weight};
  word-break: break-word;
  opacity: 0.84;

  ${({ isActive }) =>
    !isActive &&
    `
		opacity: .34;
		&:hover { opacity: 1; }
	`}

  &:active,
	&:hover {
    outline: none;
    opacity: 0.84;
  }
`;

function InspectorTabs() {
  const {
    state: { tab },
    actions: { setTab },
    data: {
      tabs: { DESIGN, DOCUMENT, PREPUBLISH },
    },
  } = useInspector();
  const tabs = [
    [DESIGN, __('Design', 'web-stories')],
    [DOCUMENT, __('Document', 'web-stories')],
    [PREPUBLISH, __('Prepublish', 'web-stories')],
  ];
  return (
    <Tabs>
      {tabs.map(([id, Text]) => (
        <Tab
          key={id}
          id={id}
          isActive={tab === id}
          aria-controls={getTabId(id)}
          aria-selected={tab === id}
          onClick={() => setTab(id)}
        >
          {Text}
        </Tab>
      ))}
    </Tabs>
  );
}

export default InspectorTabs;
