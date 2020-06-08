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
import StoryPropTypes from '../types';
import WithMask from '../masks/output';
import { getDefinitionForType } from '../elements';
import { getBox } from '../units/dimensions';
import WithLink from '../components/link/output';

function OutputElement({ element }) {
  const { id, opacity, type } = element;

  const { Output } = getDefinitionForType(type);

  // Box is calculated based on the 100%:100% basis for width and height
  const box = getBox(element, 100, 100);
  const { x, y, width, height, rotationAngle } = box;

  return (
    <WithMask
      element={element}
      box={box}
      id={'el-' + id}
      className="wrapper"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        transform: rotationAngle ? `rotate(${rotationAngle}deg)` : null,
        opacity: opacity ? opacity / 100 : null,
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
  );
}

OutputElement.propTypes = {
  element: StoryPropTypes.element.isRequired,
};

export default OutputElement;
