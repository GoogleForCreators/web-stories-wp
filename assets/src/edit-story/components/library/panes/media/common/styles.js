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
  padding-top: 1.5em;
`;

export const MediaGalleryContainer = styled.div`
  grid-area: infinitescroll;
  overflow: auto;
  padding: 0 1.5em 0 1.5em;
  margin-top: 1em;
`;

export const StyledPane = styled(Pane)`
  height: 100%;
  padding: 0;
  overflow: hidden;
`;

export const SearchInputContainer = styled.div`
  padding: 0 1.5em 0 1.5em;
`;
