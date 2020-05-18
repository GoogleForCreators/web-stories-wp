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
import { memo, useRef } from 'react';

/**
 * Internal dependencies
 */
import EditLayer from './editLayer';
import DisplayLayer from './displayLayer';
import FramesLayer from './framesLayer';
import NavLayer from './navLayer';
import SelectionCanvas from './selectionCanvas';
import { useLayoutParams, useLayoutParamsCssVars } from './layout';
import CanvasUploadDropTarget from './canvasUploadDropTarget';
import CanvasElementDropzone from './canvasElementDropzone';

const Background = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.v1};
  width: 100%;
  height: 100%;
  position: relative;
  user-select: none;
`;

function CanvasLayout() {
  const backgroundRef = useRef(null);

  useLayoutParams(backgroundRef);
  const layoutParamsCss = useLayoutParamsCssVars();

  return (
    <Background ref={backgroundRef} style={layoutParamsCss}>
      <CanvasUploadDropTarget>
        <CanvasElementDropzone>
          <SelectionCanvas>
            <DisplayLayer />
            <FramesLayer />
            <NavLayer />
          </SelectionCanvas>
          <EditLayer />
        </CanvasElementDropzone>
      </CanvasUploadDropTarget>
    </Background>
  );
}

export default memo(CanvasLayout);
