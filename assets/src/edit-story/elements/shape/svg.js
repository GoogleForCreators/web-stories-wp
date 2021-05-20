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
import { useRef } from 'react';

/**
 * Internal dependencies
 */
import {
  svgElementFillContent,
  elementWithBackgroundColor,
  elementWithBorder,
} from '../shared';
import StoryPropTypes from '../../types';
import { getResponsiveBorder } from '../../utils/elementBorder';

const Element = styled.path`
  ${svgElementFillContent}
  ${elementWithBackgroundColor}
  ${elementWithBorder}
`;

function ShapeSVG({ element }) {
  const {
    isDefaultBackground,
    backgroundColor,
    border,
    borderRadius,
    width: elementWidth,
    height: elementHeight,
  } = element;

  const ref = useRef(null);

  if (isDefaultBackground) {
    return <Element ref={ref} />;
  }

  return (
    <Element
      ref={ref}
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
      width={elementWidth}
      height={elementHeight}
      border={getResponsiveBorder(border)}
    />
  );
}

ShapeSVG.propTypes = {
  element: StoryPropTypes.elements.shape.isRequired,
};

export default ShapeSVG;
