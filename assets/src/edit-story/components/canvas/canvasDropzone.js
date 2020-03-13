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

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import { useDropTargets } from '../dropTargets';
import { useUnits } from '../../units';
import useCanvas from './useCanvas';
import useInsertElement from './useInsertElement';

const Container = styled.div``;

function CanvasDropzone({ children }) {
  const insertElement = useInsertElement();
  const {
    state: { activeDropTargetId },
  } = useDropTargets();
  const {
    state: { pageContainer },
  } = useCanvas();
  const {
    actions: { editorToDataX, editorToDataY },
  } = useUnits();

  const onDropHandler = useCallback(
    (e) => {
      const isMedia = e.dataTransfer.types.includes('resource/media');
      if (isMedia && !activeDropTargetId) {
        const {
          resource,
          offset: { x: offsetX, y: offsetY, w: offsetWidth, h: offsetHeight },
        } = JSON.parse(e.dataTransfer.getData('resource/media'));
        const { x, y } = pageContainer?.getBoundingClientRect();

        insertElement(resource.type, {
          resource,
          x: editorToDataX(e.clientX - x - offsetX),
          y: editorToDataY(e.clientY - y - offsetY),
          width: editorToDataX(offsetWidth),
          height: editorToDataY(offsetHeight),
        });
      }

      e.stopPropagation();
      e.preventDefault();
    },
    [
      activeDropTargetId,
      pageContainer,
      insertElement,
      editorToDataX,
      editorToDataY,
    ]
  );
  const onDragOverHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Container onDrop={onDropHandler} onDragOver={onDragOverHandler}>
      {children}
    </Container>
  );
}

CanvasDropzone.propTypes = {
  children: StoryPropTypes.children.isRequired,
};

export default CanvasDropzone;
