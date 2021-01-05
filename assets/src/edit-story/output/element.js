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
  getBorderPositionCSS,
  getBorderRadius,
  getBorderStyle,
  shouldDisplayBorder,
} from '../utils/elementBorder';
import generatePatternStyles from '../utils/generatePatternStyles';
import { BACKGROUND_TEXT_MODE } from '../constants';

function OutputElement({ element }) {
  const {
    id,
    opacity,
    type,
    border,
    backgroundColor,
    backgroundTextMode,
  } = element;
  const { Output } = getDefinitionForType(type);

  // Box is calculated based on the 100%:100% basis for width and height
  const box = getBox(element, 100, 100);
  const { x, y, width, height, rotationAngle } = box;

  // We're adding background styles in case of Fill here so that
  // the background and the border would match together.
  const bgStyles = {
    backgroundClip: 'content-box',
    ...generatePatternStyles(backgroundColor),
  };

  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        ...(shouldDisplayBorder(element)
          ? getBorderPositionCSS({
              ...border,
              width: `${width}%`,
              height: `${height}%`,
              posTop: `${y}%`,
              posLeft: `${x}%`,
            })
          : null),
        transform: rotationAngle ? `rotate(${rotationAngle}deg)` : null,
        opacity: typeof opacity !== 'undefined' ? opacity / 100 : null,
      }}
    >
      <StoryAnimation.AMPWrapper target={id}>
        <WithMask
          className={element.type === 'text' ? undefined : 'mask'}
          element={element}
          box={box}
          id={'el-' + id}
          style={{
            ...(shouldDisplayBorder(element) ? getBorderStyle(element) : null),
            pointerEvents: 'initial',
            width: '100%',
            height: '100%',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
            ...getBorderRadius(element),
            ...(backgroundTextMode === BACKGROUND_TEXT_MODE.FILL
              ? bgStyles
              : null),
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
      </StoryAnimation.AMPWrapper>
    </div>
  );
}

OutputElement.propTypes = {
  element: StoryPropTypes.element.isRequired,
};

export default OutputElement;
