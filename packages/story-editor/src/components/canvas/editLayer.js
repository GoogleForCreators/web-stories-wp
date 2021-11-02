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
import { memo, useEffect, useRef } from '@web-stories-wp/react';
import { _x, __ } from '@web-stories-wp/i18n';
import { useKeyDownEffect } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import { getDefinitionForType } from '../../elements';
import { useStory, useCanvas } from '../../app';
import withOverlay from '../overlay/withOverlay';
import EditElement from './editElement';
import { Layer, PageArea, MenuArea, Z_INDEX } from './layout';
import useFocusCanvas from './useFocusCanvas';

const LayerWithGrayout = styled(Layer)`
  background-color: ${({ grayout, theme }) =>
    grayout ? theme.colors.opacity.overlayDark : 'transparent'};
`;

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
  const { editModeGrayout, EditMenu } = getDefinitionForType(element.type);

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
      aria-label={_x('Edit layer', 'compound noun', 'web-stories')}
      data-testid="editLayer"
      grayout={editModeGrayout}
      zIndex={Z_INDEX.EDIT}
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
        <EditElement element={element} />
      </EditPageArea>
      {EditMenu && (
        <MenuArea showOverflow>
          <EditMenu />
        </MenuArea>
      )}
    </LayerWithGrayout>
  );
}

EditLayerForElement.propTypes = {
  element: StoryPropTypes.element.isRequired,
  showOverflow: PropTypes.bool.isRequired,
};

export default memo(EditLayer);
