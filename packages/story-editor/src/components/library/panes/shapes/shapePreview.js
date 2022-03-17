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
import {
  createRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from '@googleforcreators/react';
import styled from 'styled-components';
import { trackEvent } from '@googleforcreators/tracking';
import { createSolidFromString } from '@googleforcreators/patterns';
import { PAGE_WIDTH, useUnits } from '@googleforcreators/units';
import { ThemeGlobals, themeHelpers } from '@googleforcreators/design-system';
import { MaskTypes } from '@googleforcreators/masks';

/**
 * Internal dependencies
 */
import useLibrary from '../../useLibrary';
import LibraryMoveable from '../shared/libraryMoveable';
import InsertionOverlay from '../shared/insertionOverlay';

// By default, the element should be 33% of the page.
export const DEFAULT_ELEMENT_WIDTH = PAGE_WIDTH / 3;
const PREVIEW_SIZE = 36;

const Aspect = styled.button`
  background: transparent;
  outline: none;
  border: 0;
  padding: 0;
  position: relative;

  border-radius: ${({ theme }) => theme.borders.radius.small};
  background-color: ${({ theme }) => theme.colors.interactiveBg.previewOverlay};

  &.${ThemeGlobals.FOCUS_VISIBLE_SELECTOR} [role='presentation'],
  &[data-focus-visible-added] [role='presentation'] {
    ${({ theme }) =>
      themeHelpers.focusCSS(
        theme.colors.border.focus,
        theme.colors.bg.secondary
      )};
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
  border-radius: ${({ theme }) => theme.borders.radius.small};
  display: flex;
  justify-content: center;
  align-items: center;

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
  fill: ${({ theme }) => theme.colors.fg.primary};
`;

function ShapePreview({ mask, isPreview, index }) {
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));
  const { dataToEditorX, dataToEditorY } = useUnits((state) => ({
    dataToEditorX: state.actions.dataToEditorX,
    dataToEditorY: state.actions.dataToEditorY,
  }));

  const [active, setActive] = useState(false);
  const makeActive = () => setActive(true);
  const makeInactive = () => setActive(false);

  const ref = useRef();
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
      // Rectangles have unlocked aspect ratio by default.
      lockAspectRatio: MaskTypes.RECTANGLE !== mask.type,
    }),
    [mask.ratio, mask.type]
  );

  const onClick = useCallback(() => {
    // Shapes inserted with a specific size.
    insertElement('shape', shapeData);
    trackEvent('insert_shape', { name: mask.type });
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

  // We use rovingTabIndex for navigating so only the first item will have 0 as tabIndex.
  // onClick on Aspect is for the keyboard only.
  return (
    <Aspect
      ref={ref}
      onClick={onClick}
      tabIndex={index === 0 ? 0 : -1}
      aria-label={mask.name}
      onPointerEnter={makeActive}
      onFocus={makeActive}
      onPointerLeave={makeInactive}
      onBlur={makeInactive}
    >
      <AspectInner>
        <ShapePreviewContainer key={mask.type}>
          <ShapePreviewSizer />
          {getSVG()}
        </ShapePreviewContainer>
        {active && <InsertionOverlay />}
      </AspectInner>
      <LibraryMoveable
        type={'shape'}
        elementProps={shapeData}
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
  index: PropTypes.number,
};

export default ShapePreview;
