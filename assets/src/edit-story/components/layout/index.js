/*
 * Copyright 2021 Google LLC
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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import Library from '../library';
import Workspace from '../workspace';
import MetaBoxes from '../../integrations/wordpress/metaBoxes';
import {
  CANVAS_MIN_WIDTH,
  LIBRARY_MIN_WIDTH,
  LIBRARY_MAX_WIDTH,
  INSPECTOR_MIN_WIDTH,
  INSPECTOR_MAX_WIDTH,
} from '../../constants';
import withOverlay from '../overlay/withOverlay';
import { CanvasProvider } from '../../app/canvas';
import { PrepublishChecklistProvider } from '../inspector/prepublish';
import { HighlightsProvider } from '../../app/highlights';
import LayoutProvider from '../../app/layout/layoutProvider';
import { Snackbar, useSnackbar, themeHelpers } from '../../../design-system';

const Editor = withOverlay(styled.section.attrs({
  'aria-label': __('Web Stories Editor', 'web-stories'),
})`
  ${themeHelpers.expandTextPreset(
    ({ paragraph }, { MEDIUM }) => paragraph[MEDIUM]
  )}
  background-color: ${({ theme }) => theme.colors.bg.primary};

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

const MetaBoxesArea = styled(Area).attrs({
  area: 'metaboxes',
})`
  overflow-y: auto;
`;

function Layout() {
  const snackbarState = useSnackbar(
    ({ removeSnack, currentSnacks, placement }) => ({
      onRemove: removeSnack,
      notifications: currentSnacks,
      placement,
    })
  );
  return (
    <>
      <LayoutProvider>
        <PrepublishChecklistProvider>
          <HighlightsProvider>
            <Editor zIndex={3}>
              <CanvasProvider>
                <Area area="lib">
                  <Library />
                </Area>
                <Workspace />
              </CanvasProvider>
              <MetaBoxesArea>
                <MetaBoxes />
              </MetaBoxesArea>
            </Editor>
          </HighlightsProvider>
        </PrepublishChecklistProvider>
      </LayoutProvider>
      <Snackbar.Container {...snackbarState} />
    </>
  );
}

export default Layout;
