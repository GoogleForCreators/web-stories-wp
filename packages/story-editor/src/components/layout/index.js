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
import { __ } from '@googleforcreators/i18n';
import {
  Snackbar,
  useSnackbar,
  themeHelpers,
} from '@googleforcreators/design-system';
import { withOverlay } from '@googleforcreators/moveable';
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import Workspace from '../workspace';
import { CANVAS_MIN_WIDTH, SIDEBAR_WIDTH } from '../../constants';
import { CanvasProvider } from '../../app/canvas';
import { HighlightsProvider } from '../../app/highlights';
import LayoutProvider from '../../app/layout/layoutProvider';
import { ChecklistCheckpointProvider } from '../checklist';
import { RightClickMenuProvider } from '../../app/rightClickMenu';
import RightClickMenu from '../canvas/rightClickMenu';
import SidebarProvider from '../sidebar/sidebarProvider';
import { MediaRecordingProvider } from '../mediaRecording';

const Editor = withOverlay(styled.section.attrs({
  'aria-label': __('Web Stories Editor', 'web-stories'),
})`
  ${themeHelpers.expandTextPreset(
    ({ paragraph }, { MEDIUM }) => paragraph[MEDIUM]
  )}
  background-color: ${({ theme }) => theme.colors.bg.primary};

  position: relative;
  max-height: 100vh;
  height: 100%;
  width: 100%;
  display: grid;
  grid:
    'sidebar   canv          ' 1fr
    'sidebar   supplementary ' auto /
    ${SIDEBAR_WIDTH}px
    minmax(${CANVAS_MIN_WIDTH}px, 1fr);
`);

function Layout({ header, footer = {}, sidebarTabs, children }) {
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
            <SidebarProvider sidebarTabs={sidebarTabs}>
              <Editor zIndex={3}>
                <CanvasProvider>
                  <RightClickMenuProvider>
                    <MediaRecordingProvider>
                      <Workspace header={header} footer={footer} />
                      <RightClickMenu />
                    </MediaRecordingProvider>
                  </RightClickMenuProvider>
                </CanvasProvider>
                {children}
              </Editor>
            </SidebarProvider>
          </HighlightsProvider>
        </ChecklistCheckpointProvider>
      </LayoutProvider>
      <Snackbar.Container {...snackbarState} />
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
  header: PropTypes.node,
  footer: PropTypes.object,
  sidebarTabs: PropTypes.object,
};

export default Layout;
