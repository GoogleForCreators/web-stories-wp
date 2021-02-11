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
import { useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useDropTargets } from '../dropTargets';
import { useUnits } from '../../units';
import { isDragType } from '../../utils/dragEvent';
import { useCanvas } from '../../app';
import useInsertElement from './useInsertElement';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

function CanvasElementDropzone({ children }) {
  const insertElement = useInsertElement();

  const { activeDropTargetId } = useDropTargets((state) => ({
    activeDropTargetId: state.state.activeDropTargetId,
  }));
  const { pageContainer } = useCanvas((state) => ({
    pageContainer: state.state.pageContainer,
  }));
  const { editorToDataX, editorToDataY } = useUnits((state) => ({
    editorToDataX: state.actions.editorToDataX,
    editorToDataY: state.actions.editorToDataY,
  }));

  const onDropHandler = useCallback(
    (e) => {
      // Handles onDrop for shapes.
      if (isDragType(e, 'resource/media') && !activeDropTargetId) {
        const {
          resource,
          offset: { x: offsetX, y: offsetY, w: offsetWidth, h: offsetHeight },
        } = JSON.parse(e.dataTransfer.getData('resource/media'));
        const { x, y } = pageContainer.getBoundingClientRect();

        insertElement(resource.type, {
          resource,
          x: editorToDataX(e.clientX - x - offsetX),
          y: editorToDataY(e.clientY - y - offsetY),
          width: editorToDataX(offsetWidth),
          height: editorToDataY(offsetHeight),
        });
        e.stopPropagation();
        e.preventDefault();
      }
    },
    [
      activeDropTargetId,
      pageContainer,
      insertElement,
      editorToDataX,
      editorToDataY,
    ]
  );
  const onDragOverHandler = useCallback(
    (e) => {
      if (!isDragType(e, 'resource/media') || activeDropTargetId) {
        return;
      }
      e.stopPropagation();
      e.preventDefault();
    },
    [activeDropTargetId]
  );

  return (
    <Container onDrop={onDropHandler} onDragOver={onDragOverHandler}>
      {children}
    </Container>
  );
}

CanvasElementDropzone.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CanvasElementDropzone;
