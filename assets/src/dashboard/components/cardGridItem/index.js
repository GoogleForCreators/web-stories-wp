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
import { MoreVerticalButton } from '../storyMenu';
import { ActionLabel } from './types';

const CardGridItem = styled.div.attrs({ role: 'listitem' })`
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;

  ${MoreVerticalButton} {
    margin: 12px 0;
  }

  &:hover
    ${MoreVerticalButton},
    &:active
    ${MoreVerticalButton},
    &:focus-within
    ${MoreVerticalButton} {
    opacity: 1;
  }
`;

export default CardGridItem;
export { default as CardPreviewContainer } from './cardPreview';
export { ActionLabel };
export { default as CardTitle } from './cardTitle';
export { FocusableGridItem } from './focusableGridItem';
