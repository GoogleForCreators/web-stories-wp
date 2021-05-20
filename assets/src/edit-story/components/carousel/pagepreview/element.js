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
/**
 * Internal dependencies
 */
import { getDefinitionForType } from '../../../elements';
import {
  svgElementWithPosition,
  svgElementWithRotation,
} from '../../../elements/shared';
import getTransformFlip from '../../../elements/shared/getTransformFlip';
import StoryPropTypes from '../../../types';
import Masked from './masked';

const Position = styled.g`
  ${svgElementWithPosition}
`;

const Rotation = styled.g`
  ${svgElementWithRotation}
`;

const Flipped = styled.g`
  transform: ${({ flip }) => getTransformFlip(flip)};
  transform-origin: ${({ $width, $height }) =>
    `${$width / 2}px ${$height / 2}px`};
`;

function Element({ element }) {
  const { SVG } = getDefinitionForType(element.type);

  const { left = 0, top = 0, right = 0, bottom = 0 } = element.border || {};
  const dimensions = {
    $width: element.width + left + right,
    $height: element.height + top + bottom,
  };

  return (
    <Position $x={element.x} $y={element.y}>
      <Rotation rotationAngle={element.rotationAngle} {...dimensions}>
        <Position $x={-element.border?.left} $y={-element.border?.top}>
          <Flipped flip={element.flip} {...dimensions}>
            <g opacity={element.opacity / 100}>
              <Masked element={element}>
                <SVG element={element} />
              </Masked>
            </g>
          </Flipped>
        </Position>
      </Rotation>
    </Position>
  );
}

Element.propTypes = {
  element: StoryPropTypes.element.isRequired,
};

export default Element;
