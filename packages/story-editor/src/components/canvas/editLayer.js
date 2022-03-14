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
import styled from 'styled-components';
import {
  memo,
  useEffect,
  useRef,
  useCallback,
  useState,
} from '@googleforcreators/react';
import { _x, __ } from '@googleforcreators/i18n';
import { useKeyDownEffect } from '@googleforcreators/design-system';
import { withOverlay } from '@googleforcreators/moveable';
import { getDefinitionForType } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import { useStory, useCanvas } from '../../app';
import { Z_INDEX_EDIT_LAYER } from '../../constants/zIndex';
import useVideoTrim from '../videoTrim/useVideoTrim';
import VideoTrimmer from '../videoTrim/videoTrimmer';
import EditElement from './editElement';
import { Layer, PageArea, FooterArea } from './layout';
import useFocusCanvas from './useFocusCanvas';
import SingleSelectionMoveable from './singleSelectionMoveable';

const LayerWithGrayout = withOverlay(styled(Layer)`
  background-color: ${({ grayout, theme }) =>
    grayout ? theme.colors.opacity.overlayDark : 'transparent'};
`);

const EditPageArea = withOverlay(PageArea);

function EditLayer() {
  const { currentPage } = useStory((state) => ({
    currentPage: state.state.currentPage,
  }));

  const { editingElement: editingElementId, showOverflow = true } = useCanvas(
    ({
      state: { editingElement, editingElementState: { showOverflow } = {} },
    }) => ({
      editingElement,
      showOverflow,
    })
  );

  const editingElement =
    editingElementId &&
    currentPage &&
    currentPage.elements.find((element) => element.id === editingElementId);

  if (!editingElement) {
    return null;
  }

  return (
    <EditLayerForElement element={editingElement} showOverflow={showOverflow} />
  );
}

function EditLayerForElement({ element, showOverflow }) {
  const ref = useRef(null);
  const pageAreaRef = useRef(null);
  const { editModeGrayout } = getDefinitionForType(element.type);
  const { isTrimMode } = useVideoTrim(({ state: { isTrimMode } }) => ({
    isTrimMode,
  }));

  const { clearEditing, onMoveableMount } = useCanvas((state) => ({
    clearEditing: state.actions.clearEditing,
    onMoveableMount: state.state.onMoveableMount,
  }));

  const focusCanvas = useFocusCanvas();

  const [editWrapper, setEditWrapper] = useState(null);

  useKeyDownEffect(ref, { key: 'esc', editable: true }, () => clearEditing(), [
    clearEditing,
  ]);

  // Unmount effect to restore focus, but do not force it, in case the
  // design panel is active.
  useEffect(() => {
    return () => focusCanvas(/* force */ false);
  }, [focusCanvas]);

  const moveable = useRef(null);
  const setRef = useCallback(
    (moveableRef) => {
      moveable.current = moveableRef;
      onMoveableMount?.(moveableRef);
    },
    [onMoveableMount]
  );

  const onResize = useCallback(() => {
    // Update moveable when resizing.
    if (moveable.current) {
      moveable.current.updateRect();
    }
  }, []);

  const { hasEditModeMoveable } = getDefinitionForType(element.type);

  return (
    <LayerWithGrayout
      ref={ref}
      aria-label={_x('Edit layer', 'compound noun', 'web-stories')}
      data-testid="editLayer"
      grayout={editModeGrayout}
      zIndex={Z_INDEX_EDIT_LAYER}
      onPointerDown={(evt) => {
        if (evt.target === ref.current || evt.target === pageAreaRef.current) {
          clearEditing();
        }
      }}
    >
      <EditPageArea
        ref={pageAreaRef}
        fullBleedContainerLabel={__(
          'Fullbleed area (Edit layer)',
          'web-stories'
        )}
        isControlled
        showOverflow={showOverflow}
        overflow={showOverflow ? 'visible' : 'hidden'}
      >
        <EditElement
          editWrapper={hasEditModeMoveable && editWrapper}
          onResize={onResize}
          element={element}
          ref={setEditWrapper}
        />
      </EditPageArea>
      {hasEditModeMoveable && editWrapper && (
        <SingleSelectionMoveable
          selectedElement={element}
          targetEl={editWrapper}
          isEditMode
          ref={setRef}
        />
      )}
      {isTrimMode && (
        <FooterArea showOverflow>
          <VideoTrimmer />
        </FooterArea>
      )}
    </LayerWithGrayout>
  );
}

EditLayerForElement.propTypes = {
  element: StoryPropTypes.element.isRequired,
  showOverflow: PropTypes.bool.isRequired,
};

export default memo(EditLayer);
