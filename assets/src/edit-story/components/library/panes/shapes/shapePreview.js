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
import { createRef } from 'react';
import styled, { css } from 'styled-components';

/**
 * Internal dependencies
 */
import useLibrary from '../../useLibrary';
import { PAGE_WIDTH } from '../../../../constants';
import createSolidFromString from '../../../../utils/createSolidFromString';

// By default, the element should be 33% of the page.
const DEFAULT_ELEMENT_WIDTH = PAGE_WIDTH / 3;
const PREVIEW_SIZE = 36;

const createGrid = ({ columns, gap, minWidth }) => css`
  min-width: ${minWidth}px;
  width: calc(${100 / columns}% - ${(gap * (columns - 1)) / columns}px);
  margin-top: 0px;
  margin-left: ${gap}px;
  &:nth-of-type(n + ${columns + 1}) {
    margin-top: ${gap}px;
  }
  &:nth-of-type(${columns}n + 1) {
    margin-left: 0;
  }
`;

const Aspect = styled.div`
  position: relative;
  flex-grow: 0;
  flex-shrink: 0;
  @media screen and (min-width: 1220px) {
    ${createGrid({ columns: 4, gap: 12, minWidth: 50 })}
  }
  @media screen and (min-width: 1100px) and (max-width: 1220px) {
    ${createGrid({ columns: 3, gap: 12, minWidth: 50 })}
  }
  @media screen and (max-width: 1100px) {
    ${createGrid({ columns: 2, gap: 12, minWidth: 50 })}
  }
`;

const AspectInner = styled.div`
  position: relative;
  padding-bottom: 95.5%;
`;

const ShapePreviewContainer = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.fg.gray24};
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  svg {
    display: inline-block;
    width: 36px;
    height: 36px;
  }
`;

const ShapePreviewSizer = styled.div`
  padding-top: 100%;
`;

const Path = styled.path`
  fill: ${({ theme }) => theme.colors.fg.white};
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
    backgroundColor: createSolidFromString('#c4c4c4'),
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
    <Aspect>
      <AspectInner>
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
          <ShapePreviewSizer />
          {svg}
        </ShapePreviewContainer>
      </AspectInner>
    </Aspect>
  );
}
ShapePreview.propTypes = {
  mask: PropTypes.object.isRequired,
  isPreview: PropTypes.bool,
};

export default ShapePreview;
