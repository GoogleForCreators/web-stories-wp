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
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import { KEYBOARD_USER_SELECTOR } from '../../../utils/keyboardOnlyOutline';

const Tabs = styled.ul.attrs({
  role: 'tablist',
  'aria-orientation': 'horizontal',
})`
  background: ${({ theme }) => theme.colors.bg.v3};
  display: flex;
  height: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Tab = styled.li.attrs(({ isActive }) => ({
  tabIndex: isActive ? 0 : -1,
  role: 'tab',
  'aria-selected': isActive,
}))`
  width: 72px;
  height: 100%;
  color: ${({ theme }) => theme.colors.fg.v1};
  background: ${({ isActive, theme }) =>
    isActive ? theme.colors.bg.v4 : 'transparent'};
  border: 0;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: ${({ isActive, theme }) =>
      isActive ? theme.colors.bg.v4 : rgba(theme.colors.bg.v0, 0.2)};
  }

  ${KEYBOARD_USER_SELECTOR} &:focus {
    outline: none;
    background: ${({ theme }) => theme.colors.action};
  }

  svg {
    display: block;
    width: 28px;
    height: 28px;
    transform-origin: center center;
    transition: transform 0.3s ease;
  }
`;

const Pane = styled.section.attrs(({ isActive }) => ({
  role: 'tabpanel',
  'aria-expanded': isActive,
  hidden: !isActive,
}))`
  padding: 1.5em;
`;

function getPaneId(tab) {
  return `library-pane-${tab}`;
}

function getTabId(tab) {
  return `library-tab-${tab}`;
}

export { Tabs, Tab, Pane, getPaneId, getTabId };
