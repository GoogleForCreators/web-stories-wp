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
import Library from '../../components/library';
import Workspace from '../../components/workspace';
import {
  CANVAS_MIN_WIDTH,
  LIBRARY_MIN_WIDTH,
  LIBRARY_MAX_WIDTH,
  INSPECTOR_MIN_WIDTH,
} from '../../constants';

const Editor = styled.div`
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: ${({ theme }) => theme.fonts.body1.size};
  line-height: ${({ theme }) => theme.fonts.body1.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body1.letterSpacing};
  background-color: ${({ theme }) => theme.colors.bg.v1};

  /*
   * Custom dark scrollbars for Chromium & Firefox.
   * Scoped to <Editor> to make sure we don't mess with WP dialogs
   * like the Backbone Media Gallery dialog.
   */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.bg.v10}
      ${({ theme }) => theme.colors.bg.v3};
  }

  *::-webkit-scrollbar {
    width: 11px;
  }

  *::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.bg.v3};
  }

  *::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.bg.v10};
    border: 2px solid ${({ theme }) => theme.colors.bg.v3};
    border-left-width: 3px;
    border-radius: 6px;
  }

  position: relative;
  height: 100%;
  width: 100%;

  display: grid;
  grid-template-areas: 'lib main';
  grid-template-columns:
    minmax(${LIBRARY_MIN_WIDTH}px, ${LIBRARY_MAX_WIDTH}px)
    minmax(${CANVAS_MIN_WIDTH + INSPECTOR_MIN_WIDTH}px, 1fr);
`;

const Area = styled.div`
  grid-area: ${({ area }) => area};
  position: relative;
  overflow: hidden;
  z-index: 2;
`;

function Layout() {
  return (
    <Editor>
      <Area area="lib">
        <Library />
      </Area>
      <Area area="main">
        <Workspace />
      </Area>
    </Editor>
  );
}

export default Layout;
