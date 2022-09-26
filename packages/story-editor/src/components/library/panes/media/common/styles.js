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
import {
  Text,
  THEME_CONSTANTS,
  themeHelpers,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { Pane, PANE_PADDING } from '../../shared';

export const PaneInner = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
export const PaneHeader = styled.div`
  padding-top: 24px;
  flex: 0 1 auto;
`;

export const GalleryContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const MediaGalleryContainer = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 0 ${PANE_PADDING};
  margin-top: 1em;
  position: relative;
  width: 100%;
  flex: 1 1 auto;
  min-height: 100px;
`;

// Exceeding the parent's width here so the media items
// better align with the upload buttons and scroll bar.
export const MediaGalleryInnerContainer = styled.div`
  width: calc(100% + ${themeHelpers.SCROLLBAR_WIDTH}px);
`;

export const MediaGalleryLoadingPill = styled.div`
  display: block;
  position: absolute;
  bottom: 20px;
  left: 60px;
  right: 60px;
  width: 240px;
  text-align: center;
  padding: 8px 80px;
  background-color: ${({ theme }) => rgba(theme.colors.standard.black, 0.4)};
  border-radius: 100px;
`;

export const MediaGalleryMessage = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.MEDIUM,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
  padding: 1em;
  text-align: center;
`;

export const StyledPane = styled(Pane)`
  height: 100%;
  padding: 0;
  overflow: hidden;
`;

export const SearchInputContainer = styled.div`
  padding: 0 ${PANE_PADDING};
`;
