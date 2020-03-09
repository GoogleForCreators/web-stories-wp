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
import { getDefinitionForType } from '../../elements';
import {
  elementWithPosition,
  elementWithSize,
  elementWithRotation,
} from '../../elements/shared';
import StoryPropTypes from '../../types';
import { useTransformHandler } from '../transform';
import { useUnits } from '../../units';
import { WithElementMask } from '../../masks';

const Wrapper = styled.div`
	${elementWithPosition}
	${elementWithSize}
	${elementWithRotation}
	contain: layout paint;
`;

function DisplayElement({ element }) {
  const {
    actions: { getBox },
  } = useUnits();

  const { id, opacity, type } = element;
  const { Display } = getDefinitionForType(type);

  const wrapperRef = useRef(null);

  const box = getBox(element);

  useTransformHandler(id, (transform) => {
    const target = wrapperRef.current;
    if (transform === null) {
      target.style.transform = '';
      target.style.width = '';
      target.style.height = '';
    } else {
      const { translate, rotate, resize } = transform;
      target.style.transform = `translate(${translate[0]}px, ${translate[1]}px) rotate(${rotate}deg)`;
      if (resize[0] !== 0 && resize[1] !== 0) {
        target.style.width = `${resize[0]}px`;
        target.style.height = `${resize[1]}px`;
      }
    }
  });

  return (
    <Wrapper ref={wrapperRef} {...box}>
      <WithElementMask
        element={element}
        fill={true}
        style={{
          opacity: opacity ? opacity / 100 : null,
        }}
      >
        <Display element={element} box={box} />
      </WithElementMask>
    </Wrapper>
  );
}

DisplayElement.propTypes = {
  element: StoryPropTypes.element.isRequired,
};

export default DisplayElement;
