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
import PropTypes from 'prop-types';
import { RichTextProvider } from '@googleforcreators/rich-text';

/**
 * Internal dependencies
 */
import Sidebar from '../sidebar';
import Canvas from '../canvas';
import { VideoTrimProvider } from '../videoTrim';
import { MediaRecordingProvider } from '../mediaRecording';
import ErrorBoundary from '../errorBoundary';
import { useCanvas } from '../../app';
import { CanvasArea, SidebarArea } from './layout';

function Workspace({ header, footer }) {
  const { editingElementState } = useCanvas((state) => ({
    editingElementState: state.state.editingElementState,
  }));

  return (
    <VideoTrimProvider>
      <MediaRecordingProvider>
        <RichTextProvider editingState={editingElementState}>
          <SidebarArea>
            <ErrorBoundary>
              <Sidebar />
            </ErrorBoundary>
          </SidebarArea>
          <CanvasArea>
            <ErrorBoundary>
              <Canvas header={header} footer={footer} />
            </ErrorBoundary>
          </CanvasArea>
        </RichTextProvider>
      </MediaRecordingProvider>
    </VideoTrimProvider>
  );
}

Workspace.propTypes = {
  header: PropTypes.node,
  footer: PropTypes.object,
};

export default Workspace;
