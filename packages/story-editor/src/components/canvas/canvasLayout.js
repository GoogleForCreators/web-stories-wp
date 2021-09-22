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
import styled, { StyleSheetManager } from 'styled-components';
import { memo, useRef, useCallback } from '@web-stories-wp/react';
import { __ } from '@web-stories-wp/i18n';
import { useFeature } from 'flagged';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useCanvas } from '../../app';
import { RightClickMenuProvider } from '../../app/rightClickMenu';
import EditLayer from './editLayer';
import DisplayLayer from './displayLayer';
import FramesLayer from './framesLayer';
import NavLayer from './navLayer';
import SelectionCanvas from './selectionCanvas';
import { useLayoutParams, useLayoutParamsCssVars } from './layout';
import CanvasUploadDropTarget from './canvasUploadDropTarget';
import CanvasElementDropzone from './canvasElementDropzone';
import EyedropperLayer from './eyedropperLayer';

// data-fix-caret is for allowing caretRangeFromPoint to work in Safari.
// See https://github.com/google/web-stories-wp/issues/7745.
const Background = styled.section.attrs({
  'aria-label': __('Canvas', 'web-stories'),
  'data-fix-caret': true,
})`
  background-color: ${({ theme }) => theme.colors.bg.primary};
  width: 100%;
  height: 100%;
  position: relative;
  user-select: none;
`;

function CanvasLayout({ header }) {
  const { setCanvasContainer } = useCanvas((state) => ({
    setCanvasContainer: state.actions.setCanvasContainer,
  }));

  const enableEyedropper = useFeature('enableEyedropper');

  const backgroundRef = useRef(null);

  const setBackgroundRef = useCallback(
    (ref) => {
      backgroundRef.current = ref;
      setCanvasContainer(ref);
    },
    [setCanvasContainer]
  );

  useLayoutParams(backgroundRef);
  const layoutParamsCss = useLayoutParamsCssVars();

  // Elsewhere we use stylisRTLPlugin in case of RTL, however, since we're
  // forcing the canvas to always be LTR due to problems that otherwise come up
  // with Moveable and left-right direction, for this subtree, we are not using any plugin.
  // See also https://styled-components.com/docs/api#stylesheetmanager for general usage.
  return (
    <RightClickMenuProvider>
      <StyleSheetManager stylisPlugins={[]}>
        <Background ref={setBackgroundRef} style={layoutParamsCss}>
          <CanvasUploadDropTarget>
            <CanvasElementDropzone>
              <SelectionCanvas>
                <DisplayLayer />
                <FramesLayer />
                <NavLayer header={header} />
              </SelectionCanvas>
              <EditLayer />
              {enableEyedropper && <EyedropperLayer />}
            </CanvasElementDropzone>
          </CanvasUploadDropTarget>
        </Background>
      </StyleSheetManager>
    </RightClickMenuProvider>
  );
}

CanvasLayout.propTypes = {
  header: PropTypes.node,
};

export default memo(CanvasLayout);
