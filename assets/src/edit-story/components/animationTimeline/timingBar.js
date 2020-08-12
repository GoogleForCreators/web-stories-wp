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
import React, { useRef, useState } from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';
import Moveable from 'react-moveable';

const BAR_HEIGHT = 24;

const Bar = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #3988f7;
  width: ${({ width }) => (width / 10) * 40}px;
  height: ${BAR_HEIGHT}px;
  text-align: center;
  clip-path: polygon(
    calc(100% - ${BAR_HEIGHT / 2}px) 0,
    100% 50%,
    calc(100% - ${BAR_HEIGHT / 2}px) 100%,
    ${BAR_HEIGHT / 2}px 100%,
    0% 50%,
    ${BAR_HEIGHT / 2}px 0
  );
`;

const Handle = styled.div`
  background-color: white;
  width: 14px;
  height: 14px;
  transform: rotate(45deg);
  margin: 6px;
`;

const Label = styled.span`
  font-weight: bold;
`;

const commonMovableProps = {
  originDraggable: false,
  origin: false,
  draggable: true,
};

export default function TimingBar({ duration }) {
  const [leftRef, setLeftRef] = useState(null);
  const [rightRef, setRightRef] = useState(null);
  return (
    <Bar width={duration}>
      <Handle ref={setLeftRef}>
        <Moveable
          target={leftRef}
          onDragStart={({ target, clientX, clientY }) => {
            console.log('onDragStart', target);
          }}
          onDrag={({ target, clientX, clientY }) => {
            console.log('onDragStart', target);
          }}
          {...commonMovableProps}
        />
      </Handle>
      <Label>Hi</Label>
      <Handle ref={setRightRef}>
        <Moveable
          target={rightRef}
          onDragStart={({ target, clientX, clientY }) => {
            console.log('onDragStart', target);
          }}
          onDrag={({ target, clientX, clientY }) => {
            console.log('onDragStart', target);
          }}
          {...commonMovableProps}
        />
      </Handle>
    </Bar>
  );
}

TimingBar.propTypes = {
  duration: propTypes.number.isRequired,
  onUpdateAnimation: propTypes.func.isRequired,
};
