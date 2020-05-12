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
import React, { createRef } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import useLibrary from '../../useLibrary';
import createSolid from '../../../../utils/createSolid';
import { PAGE_WIDTH } from '../../../../constants';
import { useDropTargets } from '../../../../app';

// By default, the element should be 33% of the page.
const DEFAULT_ELEMENT_WIDTH = PAGE_WIDTH / 3;
const PREVIEW_SIZE = 36;

const ShapePreviewContainer = styled.div`
  position: relative;
  padding: 0.8em 0.5em;
  flex: 0 0 25%;
  display: flex;
  justify-content: center;
`;

const Path = styled.path`
  fill: ${({ theme }) => theme.colors.fg.v1};
`;

function ShapePreview(mask) {
  const {
    actions: { insertElement },
  } = useLibrary();

  const {
    actions: { handleDrop, setDraggingResource },
  } = useDropTargets();

  // Creating a ref to the Path so that it can be used as a drag icon.
  // This avoids the drag image that follows the cursor from being the whole
  // component with large paddings, and only drags the svg part of it.
  // TODO(jhtin) Make the background completely transparent in the drag image.
  const pathRef = createRef();

  // Contains the props to be passed in for insertElement() calls in order
  // to insert the correct shape.
  const props = {
    backgroundColor: createSolid(51, 51, 51),
    width: DEFAULT_ELEMENT_WIDTH * mask.ratio,
    height: DEFAULT_ELEMENT_WIDTH,
    mask: {
      type: mask.type,
    },
  };

  const svg = (
    <svg
      viewBox={`0 0 1 ${1 / mask.ratio}`}
      width={PREVIEW_SIZE * mask.ratio}
      height={PREVIEW_SIZE}
    >
      <title>{mask.name}</title>
      <Path d={mask.path} ref={pathRef} />
    </svg>
  );

  const resource = { type: 'shape' };
  // Callback that sets the drag image and adds information about the shape
  // to be used in an [insertElement] call on the drop handler.
  const onDragStart = (e) => {
    setDraggingResource(resource);

    e.dataTransfer.setDragImage(pathRef.current, 0, 0);
    e.dataTransfer.setData('shape', JSON.stringify(props));
  };

  const onDragEnd = (e) => {
    e.preventDefault();
    setDraggingResource(null);
    handleDrop('shape');
  };

  return (
    <ShapePreviewContainer
      key={mask.type}
      draggable={true}
      onClick={() => {
        // Shapes inserted with a specific size.
        insertElement('shape', props);
      }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {svg}
    </ShapePreviewContainer>
  );
}

export default ShapePreview;
