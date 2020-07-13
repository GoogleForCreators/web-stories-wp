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
import { Pane } from '../../shared';

export const PaneInner = styled.div`
  height: 100%;
  display: grid;
  grid:
    'header' auto
    'infinitescroll' 1fr
    / 1fr;
`;
export const PaneHeader = styled.div`
  grid-area: header;
  padding-top: 24px;
`;

export const MediaGalleryContainer = styled.div`
  display: grid;
  grid-area: infinitescroll;
  overflow: auto;
  grid-template-columns: 1fr;
  padding: 0 24px;
  margin-top: 1em;
  position: relative;
  width: 100%;
`;

// 312px is the width of the gallery minus the 24px paddings.
export const MediaGalleryInnerContainer = styled.div`
  width: 312px;
`;

export const MediaGalleryLoadingPill = styled.div`
  grid-column: 1 / span 2;
  margin-bottom: 16px;
  text-align: center;
  padding: 8px 80px;
  background-color: ${({ theme }) => rgba(theme.colors.bg.v0, 0.4)};
  border-radius: 100px;
  margin-top: auto;
  font-size: ${({ theme }) => theme.fonts.label.size};
  line-height: ${({ theme }) => theme.fonts.label.lineHeight};
  font-weight: 500;
`;

export const MediaGalleryMessage = styled.div`
  color: ${({ theme }) => theme.colors.fg.v1};
  font-size: 16px;
  padding: 1em;
`;

export const StyledPane = styled(Pane)`
  height: 100%;
  padding: 0;
  overflow: hidden;
`;

export const SearchInputContainer = styled.div`
  padding: 0 24px;
`;
