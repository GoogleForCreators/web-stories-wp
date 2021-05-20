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
import generatePatternStyles from '../../../utils/generatePatternStyles';
import Masked from './masked';
import { getBox } from './utils';

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

const BackgroundOverlay = styled.div`
  width: 100%;
  height: 100%;
`;

function Element({ element }) {
  const { SVG } = getDefinitionForType(element.type);

  const box = getBox(element);

  const $dimensions = {
    $width: box.width,
    $height: box.height,
  };
  const dimensions = {
    width: box.width,
    height: box.height,
  };
  const offset = {
    $x: -element.border?.left || 0,
    $y: -element.border?.top || 0,
  };

  return (
    <Position $x={box.x} $y={box.y}>
      <Rotation rotationAngle={box.rotationAngle} {...$dimensions}>
        <Position {...offset}>
          <Flipped flip={element.flip} {...$dimensions}>
            <g opacity={element.opacity / 100}>
              <Masked element={element}>
                <SVG element={element} box={box} />
                {element.isBackground && element.backgroundOverlay && (
                  <foreignObject {...dimensions}>
                    <BackgroundOverlay
                      style={generatePatternStyles(element.backgroundOverlay)}
                    />
                  </foreignObject>
                )}
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
