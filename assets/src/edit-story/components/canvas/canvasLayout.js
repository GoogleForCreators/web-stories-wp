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
import { useFeature } from 'flagged';
import styled, { StyleSheetManager } from 'styled-components';
import { memo, useRef, useCallback } from 'react';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useCanvas } from '../../app';
import { AnimatedContextMenu } from '../../../design-system';
import { useQuickActions } from '../../app/highlights';
import EditLayer from './editLayer';
import DisplayLayer from './displayLayer';
import FramesLayer from './framesLayer';
import NavLayer from './navLayer';
import SelectionCanvas from './selectionCanvas';
import { useLayoutParams, useLayoutParamsCssVars } from './layout';
import CanvasUploadDropTarget from './canvasUploadDropTarget';
import CanvasElementDropzone from './canvasElementDropzone';

const Background = styled.section.attrs({
  'aria-label': __('Canvas', 'web-stories'),
})`
  background-color: ${({ theme }) => theme.colors.bg.primary};
  width: 100%;
  height: 100%;
  position: relative;
  user-select: none;
`;

const MenuContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
`;

function CanvasLayout() {
  const enableQuickActionMenus = useFeature('enableQuickActionMenus');

  const quickActions = useQuickActions();
  const { setCanvasContainer } = useCanvas((state) => ({
    setCanvasContainer: state.actions.setCanvasContainer,
  }));

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
    <StyleSheetManager stylisPlugins={[]}>
      <Background ref={setBackgroundRef} style={layoutParamsCss}>
        {/* TODO: Replace with real quick actions menu */}
        {enableQuickActionMenus && (
          <MenuContainer>
            <AnimatedContextMenu items={quickActions} isOpen />
          </MenuContainer>
        )}
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
    </StyleSheetManager>
  );
}

export default memo(CanvasLayout);
