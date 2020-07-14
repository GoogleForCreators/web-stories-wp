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
import { memo, useEffect, useRef } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import { getDefinitionForType } from '../../elements';
import { useKeyDownEffect } from '../keyboard';
import { useStory } from '../../app';
import withOverlay from '../overlay/withOverlay';
import EditElement from './editElement';
import { Layer, PageArea, Z_INDEX } from './layout';
import useCanvas from './useCanvas';
import useFocusCanvas from './useFocusCanvas';

const LayerWithGrayout = styled(Layer)`
  background-color: ${({ grayout, theme }) =>
    grayout ? theme.colors.grayout : 'transparent'};
`;

const EditPageArea = withOverlay(PageArea);

function EditLayer() {
  const { currentPage } = useStory((state) => ({
    currentPage: state.state.currentPage,
  }));
  const { editingElementId } = useCanvas((state) => ({
    editingElementId: state.state.editingElement,
  }));

  const editingElement =
    editingElementId &&
    currentPage &&
    currentPage.elements.find((element) => element.id === editingElementId);

  if (!editingElement) {
    return null;
  }

  return <EditLayerForElement element={editingElement} />;
}

function EditLayerForElement({ element }) {
  const ref = useRef(null);
  const pageAreaRef = useRef(null);
  const { editModeGrayout } = getDefinitionForType(element.type);

  const { clearEditing } = useCanvas((state) => ({
    clearEditing: state.actions.clearEditing,
  }));

  const focusCanvas = useFocusCanvas();

  useKeyDownEffect(ref, { key: 'esc', editable: true }, () => clearEditing(), [
    clearEditing,
  ]);

  // Unmount effect to restore focus, but do not force it, in case the
  // design panel is active.
  useEffect(() => {
    return () => focusCanvas(/* force */ false);
  }, [focusCanvas]);

  return (
    <LayerWithGrayout
      ref={ref}
      aria-label={__('Edit layer', 'web-stories')}
      data-testid="editLayer"
      grayout={editModeGrayout}
      zIndex={Z_INDEX.EDIT}
      onPointerDown={(evt) => {
        if (evt.target === ref.current || evt.target === pageAreaRef.current) {
          clearEditing();
        }
      }}
    >
      <EditPageArea ref={pageAreaRef} showOverflow={editModeGrayout}>
        <EditElement element={element} />
      </EditPageArea>
    </LayerWithGrayout>
  );
}

EditLayerForElement.propTypes = {
  element: StoryPropTypes.element.isRequired,
};

export default memo(EditLayer);
