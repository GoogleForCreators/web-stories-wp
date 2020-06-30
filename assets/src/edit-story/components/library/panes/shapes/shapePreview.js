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
import React, { createRef } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import useLibrary from '../../useLibrary';
import createSolid from '../../../../utils/createSolid';
import { PAGE_WIDTH } from '../../../../constants';

// By default, the element should be 33% of the page.
const DEFAULT_ELEMENT_WIDTH = PAGE_WIDTH / 3;
const PREVIEW_SIZE = 36;

const ShapePreviewContainer = styled.button`
  background: transparent;
  border: 0;
  position: relative;
  padding: 0.8em 0.5em;
  flex: 0 0 25%;
  display: flex;
  justify-content: center;
  cursor: pointer;
`;

const Path = styled.path`
  fill: ${({ theme }) => theme.colors.fg.v1};
`;

function ShapePreview({ mask, isPreview }) {
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  // Creating a ref to the Path so that it can be used as a drag icon.
  // This avoids the drag image that follows the cursor from being the whole
  // component with large paddings, and only drags the svg part of it.
  const pathRef = createRef();

  // Contains the data to be passed in for insertElement() calls in order
  // to insert the correct shape.
  const shapeData = {
    backgroundColor: createSolid(255, 255, 255),
    width: DEFAULT_ELEMENT_WIDTH * mask.ratio,
    height: DEFAULT_ELEMENT_WIDTH,
    mask: {
      type: mask.type,
    },
  };

  const svg = (
    <svg
      viewBox={`0 0 1 ${
        1 / (isPreview && mask.iconRatio ? mask.iconRatio : mask.ratio)
      }`}
      width={
        PREVIEW_SIZE *
        (isPreview && mask.iconRatio ? mask.iconRatio : mask.ratio)
      }
      height={PREVIEW_SIZE}
    >
      <title>{mask.name}</title>
      <Path
        d={isPreview && mask.iconPath ? mask.iconPath : mask.path}
        ref={pathRef}
      />
    </svg>
  );

  // Callback that sets the drag image and adds information about the shape
  // to be used in an [insertElement] call on the drop handler.
  const onDragStart = (e) => {
    const { x, y } = pathRef.current.getBoundingClientRect();
    const offsetX = e.clientX - x;
    const offsetY = e.clientY - y;
    e.dataTransfer.setDragImage(pathRef.current, offsetX, offsetY);
    e.dataTransfer.setData('shape', JSON.stringify(shapeData));
  };

  return (
    <ShapePreviewContainer
      key={mask.type}
      draggable={true}
      aria-label={mask.name}
      onClick={() => {
        // Shapes inserted with a specific size.
        insertElement('shape', shapeData);
      }}
      onDragStart={onDragStart}
    >
      {svg}
    </ShapePreviewContainer>
  );
}
ShapePreview.propTypes = {
  mask: PropTypes.object.isRequired,
  isPreview: PropTypes.bool,
};

export default ShapePreview;
