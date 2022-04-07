/*
 * Copyright 2022 Google LLC
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
import styled, { keyframes } from 'styled-components';
import { useRef } from '@googleforcreators/react';
import {
  createSolid,
  generatePatternStyles,
} from '@googleforcreators/patterns';
import { StoryPropTypes } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { elementFillContent } from '../shared';
import useColorTransformHandler from '../shared/useColorTransformHandler';

const Element = styled.div`
  ${elementFillContent}
`;

const animateInSequenceBefore = keyframes`
  0% {
    animation-timing-function: cubic-bezier(.85, 0, .15, 1);
    transform: scale(0);
  }
  60% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
  }
`;

const pulseDotBefore = keyframes`
0% {
    animation-timing-function: cubic-bezier(.83,0,.71,.99);
    transform: scale(1);
  }
  40% {
    transform: scale(.8);
  }
  90% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
  }
  `;

const animateInSequenceAfter = keyframes`
0% {
    animation-timing-function: cubic-bezier(.85, 0, .15, 1);
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
  }
`;

const pulseDotAfter = keyframes`
0% {
    animation-timing-function: cubic-bezier(0.76, 0, 0.24, 1);
    transform: scale(1);
  }
  40% {
    transform: scale(.8);
  }
  90% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
  }
`;

// See https://github.com/ampproject/amphtml/blob/160dcd9c93d34bb7da073a1240c287fc0cf14591/extensions/amp-story-shopping/0.1/amp-story-shopping-tag.css#L56-L154
const ShoppingTagDot = styled.div`
  border-radius: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 100%;
  height: 100%;

  &:before {
    content: '';
    position: absolute;
    border-radius: inherit;
    width: 100%;
    height: 100%;
    ${generatePatternStyles(createSolid(125, 125, 125, 0.75))};
  }

  @media (prefers-reduced-motion: no-preference) {
    &:before {
      animation: ${animateInSequenceBefore} 2s forwards,
        ${pulseDotBefore} 2.5s 1.5s infinite;
    }
  }

  &:after {
    content: '';
    position: absolute;
    border-radius: inherit;
    width: 50%;
    height: 50%;
    ${generatePatternStyles(
      createSolid(125, 125, 125, 0.75),
      '--box-shadow-color'
    )};
    box-shadow: 0 2px 8px var(--box-shadow-color);
    background-color: white;
  }

  @media (prefers-reduced-motion: no-preference) {
    &:after {
      animation: ${animateInSequenceAfter} 2s forwards,
        ${pulseDotAfter} 2.5s calc(1.5s * 1.2) infinite;
    }
  }
`;

function ProductDisplay({ element }) {
  const { id, width: elementWidth, height: elementHeight } = element;

  const ref = useRef(null);
  useColorTransformHandler({ id, targetRef: ref });

  return (
    <Element ref={ref} width={elementWidth} height={elementHeight}>
      <ShoppingTagDot
        elementWidth={elementWidth}
        elementHeight={elementHeight}
      />
    </Element>
  );
}

ProductDisplay.propTypes = {
  element: StoryPropTypes.elements.shape.isRequired,
};

export default ProductDisplay;
