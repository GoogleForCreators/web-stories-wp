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
import { useRef } from 'react';
import { useUnits } from '../../units';
import { Wrapper } from '../../components/canvas/displayElement';
import { useTransformHandler } from '../transform';
import { ReactComponent as Cross } from './cross.svg';

const GrayBox = styled.div`
  background: #ccc;
  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;
const CrossIcon = styled(Cross)``;

function DummyElement({ element }) {
  const {
    actions: { getBox },
  } = useUnits();
  const { id } = element;
  const wrapperRef = useRef(null);

  useTransformHandler(id, (transform) => {
    const target = wrapperRef.current;
    if (transform === null) {
      target.style.transform = '';
      target.style.width = '';
      target.style.height = '';
    } else {
      const { translate, rotate, resize, dropTargets } = transform;
      target.style.transform = `translate(${translate?.[0]}px, ${translate?.[1]}px) rotate(${rotate}deg)`;
      if (resize && resize[0] !== 0 && resize[1] !== 0) {
        target.style.width = `${resize[0]}px`;
        target.style.height = `${resize[1]}px`;
      }
      if (dropTargets?.hover !== undefined) {
        target.style.opacity = dropTargets.hover ? 0 : 1;
      }
      // if (dropTargets?.replacement !== undefined) {
      //   setReplacement(dropTargets.replacement || null);
      // }
    }
  });

  const box = getBox(element);
  return (
    <Wrapper ref={wrapperRef} {...box}>
      <GrayBox>
        <CrossIcon />
      </GrayBox>
    </Wrapper>
  );
}

export default DummyElement;
