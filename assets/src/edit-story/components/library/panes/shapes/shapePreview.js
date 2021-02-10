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
import React, { createRef, useCallback, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import useLibrary from '../../useLibrary';
import { PAGE_WIDTH } from '../../../../constants';
import createSolidFromString from '../../../../utils/createSolidFromString';
import LibraryMoveable from '../shared/libraryMoveable';
import { useUnits } from '../../../../units';

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

// Using button directly breaks the DOM nesting for tests.
const Aspect = styled.div.attrs({ role: 'button' })`
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

const ShapePreviewContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.gray24};
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

const ShapeClone = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  svg {
    display: inline-block;
    width: 100%;
    height: 100%;
    path {
      fill: #c4c4c4;
    }
  }
`;

const ShapePreviewSizer = styled.div`
  padding-top: 100%;
`;

const Path = styled.path`
  fill: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};
`;

function ShapePreview({ mask, isPreview }) {
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));
  const { dataToEditorX, dataToEditorY } = useUnits((state) => ({
    dataToEditorX: state.actions.dataToEditorX,
    dataToEditorY: state.actions.dataToEditorY,
  }));

  // Creating a ref to the Path so that it can be used as a drag icon.
  // This avoids the drag image that follows the cursor from being the whole
  // component with large paddings, and only drags the svg part of it.
  const pathRef = createRef();

  // Contains the data to be passed in for insertElement() calls in order
  // to insert the correct shape.
  const shapeData = useMemo(
    () => ({
      backgroundColor: createSolidFromString('#c4c4c4'),
      width: DEFAULT_ELEMENT_WIDTH * mask.ratio,
      height: DEFAULT_ELEMENT_WIDTH,
      mask: {
        type: mask.type,
      },
    }),
    [mask.ratio, mask.type]
  );

  const onClick = useCallback(() => {
    // Shapes inserted with a specific size.
    insertElement('shape', shapeData);
    trackEvent('insert_shape', 'editor', null, null, { type: mask.type });
  }, [insertElement, shapeData, mask.type]);

  const getSVG = (displayLabel = true) => {
    return (
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
        {displayLabel && <title>{mask.name}</title>}
        <Path
          d={isPreview && mask.iconPath ? mask.iconPath : mask.path}
          ref={pathRef}
        />
      </svg>
    );
  };

  return (
    <Aspect>
      <AspectInner>
        <ShapePreviewContainer key={mask.type} aria-label={mask.name}>
          <ShapePreviewSizer />
          {getSVG()}
        </ShapePreviewContainer>
      </AspectInner>
      <LibraryMoveable
        type={'shape'}
        elementProps={shapeData}
        onClick={onClick}
        cloneElement={ShapeClone}
        cloneProps={{
          width: dataToEditorX(DEFAULT_ELEMENT_WIDTH * mask.ratio),
          height: dataToEditorY(DEFAULT_ELEMENT_WIDTH),
          children: getSVG(false),
        }}
      />
    </Aspect>
  );
}
ShapePreview.propTypes = {
  mask: PropTypes.object.isRequired,
  isPreview: PropTypes.bool,
};

export default ShapePreview;
