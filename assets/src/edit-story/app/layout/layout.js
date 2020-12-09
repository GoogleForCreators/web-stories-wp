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
import Library from '../../components/library';
import Workspace from '../../components/workspace';
import MetaBoxes from '../../integrations/wordpress/components/metaBoxes';
import {
  CANVAS_MIN_WIDTH,
  LIBRARY_MIN_WIDTH,
  LIBRARY_MAX_WIDTH,
  INSPECTOR_MIN_WIDTH,
  INSPECTOR_MAX_WIDTH,
} from '../../constants';
import withOverlay from '../../components/overlay/withOverlay';
import CanvasProvider from '../../components/canvas/canvasProvider';
import LayoutProvider from './layoutProvider';

const Editor = withOverlay(styled.section.attrs({
  'aria-label': __('Web Stories Editor', 'web-stories'),
})`
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: ${({ theme }) => theme.fonts.body1.size};
  line-height: ${({ theme }) => theme.fonts.body1.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body1.letterSpacing};
  background-color: ${({ theme }) => theme.colors.bg.workspace};

  position: relative;
  height: 100%;
  width: 100%;

  display: grid;
  grid:
    'lib   canv        insp' 1fr
    'lib   metaboxes   insp' auto /
    minmax(${LIBRARY_MIN_WIDTH}px, ${LIBRARY_MAX_WIDTH}px)
    minmax(${CANVAS_MIN_WIDTH}px, 1fr)
    minmax(${INSPECTOR_MIN_WIDTH}px, ${INSPECTOR_MAX_WIDTH}px);
`);

const Area = styled.div`
  grid-area: ${({ area }) => area};
  position: relative;
  overflow: hidden;
  z-index: 2;
`;

// TODO: Fix meta boxes layout.
function Layout() {
  return (
    <LayoutProvider>
      <Editor zIndex={3}>
        <CanvasProvider>
          <Area area="lib">
            <Library />
          </Area>
          <Workspace />
        </CanvasProvider>
        <Area area="metaboxes">
          <MetaBoxes />
        </Area>
      </Editor>
    </LayoutProvider>
  );
}

export default Layout;
