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
import { Icons } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import {
  STORY_PREVIEW_WIDTH,
  VIEWPORT_BREAKPOINT,
} from '../../../../../constants';
import { TableRow, MoreVerticalButton } from '../../../../../components';

export const PreviewImage = styled.div`
  display: inline-block;
  background: ${({ theme }) => theme.colors.gradient.placeholder};
  width: ${STORY_PREVIEW_WIDTH[VIEWPORT_BREAKPOINT.THUMBNAIL]}px;
  height: ${STORY_PREVIEW_WIDTH[VIEWPORT_BREAKPOINT.THUMBNAIL] / (3 / 4)}px;
  object-fit: contain;
  border-radius: ${({ theme }) => theme.borders.radius.small};
`;
export const PreviewWrapper = styled.div`
  position: relative;
`;

export const LockIcon = styled(Icons.LockClosed)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 24px;
  display: block;
  margin: auto;
  background-color: ${({ theme }) => theme.colors.interactiveBg.brandNormal};
  color: ${({ theme }) => theme.colors.standard.white};
  border-radius: ${({ theme }) => theme.borders.radius.round};
`;

export const StyledTableRow = styled(TableRow)`
  &:hover ${MoreVerticalButton}, &:focus-within ${MoreVerticalButton} {
    opacity: 1;
  }
`;

export const TitleTableCellContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  ${MoreVerticalButton} {
    margin: 10px auto;
  }

  &:hover ${MoreVerticalButton}, &:active ${MoreVerticalButton} {
    opacity: 1;
  }
`;
