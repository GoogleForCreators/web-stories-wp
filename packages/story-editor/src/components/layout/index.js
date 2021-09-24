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
import {
  Snackbar,
  useSnackbar,
  themeHelpers,
} from '@web-stories-wp/design-system';
import Proptypes from 'prop-types';
/**
 * Internal dependencies
 */
import Library from '../library';
import Workspace from '../workspace';
import {
  CANVAS_MIN_WIDTH,
  LIBRARY_MIN_WIDTH,
  LIBRARY_MAX_WIDTH,
  INSPECTOR_MIN_WIDTH,
  INSPECTOR_MAX_WIDTH,
} from '../../constants';
import withOverlay from '../overlay/withOverlay';
import { CanvasProvider } from '../../app/canvas';
import { HighlightsProvider } from '../../app/highlights';
import LayoutProvider from '../../app/layout/layoutProvider';
import { ChecklistCheckpointProvider } from '../checklist';

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
    'lib   supplementary insp' auto /
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

function Layout({ header, children }) {
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
        <ChecklistCheckpointProvider>
          <HighlightsProvider>
            <Editor zIndex={3}>
              <CanvasProvider>
                <Area area="lib">
                  <Library />
                </Area>
                <Workspace header={header} />
              </CanvasProvider>
              {children}
            </Editor>
          </HighlightsProvider>
        </ChecklistCheckpointProvider>
      </LayoutProvider>
      <Snackbar.Container {...snackbarState} />
    </>
  );
}

Layout.propTypes = {
  children: Proptypes.node,
  header: Proptypes.node,
};

export default Layout;
