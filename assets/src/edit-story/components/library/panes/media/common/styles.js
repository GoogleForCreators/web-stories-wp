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

// 312px is the width of the gallery minus the 24px paddings.
// We add a -4px l/r margin because the react-photo-gallery adds 4px margins
// around images.
// Width is thus 312-(-4)*2=320
// TODO (pbakaus@): this needs a refactor for less magic numbers, but for now,
// replacing 320px with the calc below produces the exact result in a dynamic,
// scalable way.
export const MediaGalleryInnerContainer = styled.div`
  width: calc(100% + 19px);
  margin: 0 -4px;
`;

export const MediaGalleryLoadingPill = styled.div`
  position: absolute;
  bottom: 20px;
  left: 60px;
  right: 60px;
  width: 240px;
  text-align: center;
  padding: 8px 80px;
  background-color: ${({ theme }) =>
    rgba(theme.DEPRECATED_THEME.colors.bg.black, 0.4)};
  border-radius: 100px;
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.label.size};
  line-height: ${({ theme }) => theme.DEPRECATED_THEME.fonts.label.lineHeight};
  font-weight: 500;
`;

export const MediaGalleryMessage = styled.div`
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};
  padding: 1em;
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.mediaError.family};
  font-style: ${({ theme }) => theme.DEPRECATED_THEME.fonts.mediaError.style};
  line-height: ${({ theme }) =>
    theme.DEPRECATED_THEME.fonts.mediaError.lineHeight};
  font-weight: ${({ theme }) => theme.DEPRECATED_THEME.fonts.mediaError.weight};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.mediaError.size};
  text-align: ${({ theme }) =>
    theme.DEPRECATED_THEME.fonts.mediaError.textAlign};
  opacity: 0.54;
`;

export const StyledPane = styled(Pane)`
  height: 100%;
  padding: 0;
  overflow: hidden;
`;

export const SearchInputContainer = styled.div`
  padding: 0 ${PANE_PADDING};
`;
