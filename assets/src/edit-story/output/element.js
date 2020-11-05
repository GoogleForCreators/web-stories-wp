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
 * Internal dependencies
 */
import { StoryAnimation } from '../../animation';
import WithLink from '../components/elementLink/output';
import { getDefinitionForType } from '../elements';
import WithMask from '../masks/output';
import StoryPropTypes from '../types';
import { getBox } from '../units/dimensions';
import {
  getBorderStyle,
  shouldDisplayBorder,
} from '../components/elementBorder/utils';
import ElementBorder from '../components/elementBorder/output';
import { canMaskHaveBorder } from '../masks';
import { BORDER_POSITION } from '../constants';

function OutputElement({ element }) {
  const { id, opacity, type, borderRadius, border } = element;
  const { Output } = getDefinitionForType(type);

  // Box is calculated based on the 100%:100% basis for width and height
  const box = getBox(element, 100, 100);
  const { x, y, width, height, rotationAngle } = box;

  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left:
          border?.position === BORDER_POSITION.OUTSIDE
            ? `calc(${x}% - ${border.left}px)`
            : `${x}%`,
        top:
          border?.position === BORDER_POSITION.OUTSIDE
            ? `calc(${y}% - ${border.top}px)`
            : `${y}%`,
        width:
          border?.position === BORDER_POSITION.OUTSIDE
            ? `calc(${width}% + ${border.left + border.right}px)`
            : `${width}%`,
        height:
          border?.position === BORDER_POSITION.OUTSIDE
            ? `calc(${height}% + ${border.top + border.bottom}px)`
            : `${height}%`,
        transform: rotationAngle ? `rotate(${rotationAngle}deg)` : null,
        opacity: typeof opacity !== 'undefined' ? opacity / 100 : null,
      }}
    >
      <StoryAnimation.AMPWrapper target={id}>
        <WithMask
          className="mask"
          element={element}
          box={box}
          id={'el-' + id}
          style={{
            ...(border?.position === BORDER_POSITION.OUTSIDE
              ? getBorderStyle({ ...border, borderRadius })
              : null),
            pointerEvents: 'initial',
            width: '100%',
            height: '100%',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius:
              borderRadius && canMaskHaveBorder(element)
                ? `${borderRadius.topLeft}px ${borderRadius.topRight}px ${borderRadius.bottomRight}px ${borderRadius.bottomLeft}px`
                : null,
          }}
          skipDefaultMask
        >
          <WithLink
            element={element}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <Output element={element} box={box} />
          </WithLink>
        </WithMask>
        {border?.position !== BORDER_POSITION.OUTSIDE &&
          shouldDisplayBorder(element) && (
            <ElementBorder border={{ ...element.border, borderRadius }} />
          )}
      </StoryAnimation.AMPWrapper>
    </div>
  );
}

OutputElement.propTypes = {
  element: StoryPropTypes.element.isRequired,
};

export default OutputElement;
