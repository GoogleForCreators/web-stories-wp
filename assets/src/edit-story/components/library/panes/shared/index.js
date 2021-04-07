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

export const PANE_PADDING = '1em';

const Pane = styled.section.attrs(({ isActive }) => ({
  role: 'tabpanel',
  'aria-expanded': isActive,
  hidden: !isActive,
}))`
  padding: 1.5em ${PANE_PADDING};
`;

function getPaneId(tab) {
  return `library-pane-${tab}`;
}

function getTabId(tab) {
  return `library-tab-${tab}`;
}

export { Pane, getPaneId, getTabId };

export { default as ChipGroup } from './chipGroup';
