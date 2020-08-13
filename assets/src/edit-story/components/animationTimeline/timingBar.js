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
import React, { useCallback, useRef, useState } from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';
import Moveable from 'react-moveable';

/**
 * Internal dependencies
 */
import { MARK_OFFSET } from './ruler';

const BAR_HEIGHT = 24;

const Bar = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #3988f7;
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

export default function TimingBar({ duration, offset, onUpdateAnimation }) {
  const [leftRef, setLeftRef] = useState(null);
  const [rightRef, setRightRef] = useState(null);
  const dragStart = useRef(0);
  const startingDuration = useRef(0);
  const startingOffset = useRef(0);

  const [d, setDuration] = useState(duration);
  const [o, setOffset] = useState(offset);

  const handleDragStart = useCallback(
    ({ clientX }) => {
      dragStart.current = clientX;
      startingDuration.current = duration;
      startingOffset.current = offset;
    },
    [duration, offset]
  );

  const handleDragEnd = useCallback(() => {
    onUpdateAnimation({ duration: d, offset: o });
  }, [d, o, onUpdateAnimation]);

  const handleDragLeft = useCallback(({ clientX }) => {
    const movedMilliseconds =
      ((clientX - dragStart.current) / MARK_OFFSET) * 100;
    setOffset(movedMilliseconds + startingOffset.current);
    setDuration(startingDuration.current - movedMilliseconds);
  }, []);

  const handleDragRight = useCallback(({ clientX }) => {
    const movedMilliseconds =
      ((clientX - dragStart.current) / MARK_OFFSET) * 100;
    setDuration(movedMilliseconds + startingDuration.current);
  }, []);

  return (
    <Bar
      style={{ width: (d / 100) * MARK_OFFSET, left: (o / 100) * MARK_OFFSET }}
    >
      <Handle ref={setLeftRef}>
        <Moveable
          target={leftRef}
          onDragStart={handleDragStart}
          onDrag={handleDragLeft}
          onDragEnd={handleDragEnd}
          {...commonMovableProps}
        />
      </Handle>
      <Label>Hi</Label>
      <Handle ref={setRightRef}>
        <Moveable
          target={rightRef}
          onDragStart={handleDragStart}
          onDrag={handleDragRight}
          onDragEnd={handleDragEnd}
          {...commonMovableProps}
        />
      </Handle>
    </Bar>
  );
}

TimingBar.propTypes = {
  duration: propTypes.number.isRequired,
  offset: propTypes.number.isRequired,

  onUpdateAnimation: propTypes.func.isRequired,
};
