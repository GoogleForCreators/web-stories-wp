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
 * Internal dependencies
 */
import Inspector from '../inspector';
import Canvas from '../canvas';
import CanvasProvider from '../canvas/canvasProvider';
import RichTextProvider from '../richText/provider';
import ErrorBoundary from '../errorBoundary';
import { WorkspaceLayout, CanvasArea, InspectorArea } from './layout';

function Workspace() {
  return (
    <CanvasProvider>
      <RichTextProvider>
        <WorkspaceLayout>
          <CanvasArea>
            <ErrorBoundary>
              <Canvas />
            </ErrorBoundary>
          </CanvasArea>
          <InspectorArea>
            <ErrorBoundary>
              <Inspector />
            </ErrorBoundary>
          </InspectorArea>
        </WorkspaceLayout>
      </RichTextProvider>
    </CanvasProvider>
  );
}

export default Workspace;
