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
import { useKeyDownEffect } from '../../components/keyboard';
import { MARK_OFFSET, MS_DIVISOR } from './ruler';

const BAR_HEIGHT = 24;
const KEY_OFFSET_MS = 100;
const MIN_ANIMATION_MS = 100;

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
  overflow: hidden;
`;

const Handle = styled.div.attrs({ tabIndex: 0 })`
  background-color: white;
  width: 14px;
  height: 14px;
  transform: rotate(45deg);
  margin: 6px;
  cursor: ew-resize;
`;

const Label = styled.div.attrs({ tabIndex: 0 })`
  font-family: ${({ theme }) => theme.fonts.label.family};
  flex: 1;
  font-weight: bold;
  font-size: 12px;
  cursor: grabbing;
`;

const commonMovableProps = {
  originDraggable: false,
  origin: false,
  draggable: true,
};

export default function TimingBar({
  duration,
  maxDuration,
  offset,
  label,
  onUpdateAnimation,
}) {
  const [leftRef, setLeftRef] = useState();
  const [middleRef, setMiddleRef] = useState();
  const [rightRef, setRightRef] = useState();
  const dragStart = useRef(0);
  const startingDuration = useRef(0);
  const startingOffset = useRef(0);

  const [internalDuration, setDuration] = useState(duration);
  const [internalOffset, setOffset] = useState(offset);

  const handleDragStart = useCallback(
    ({ clientX }) => {
      dragStart.current = clientX;
      startingDuration.current = duration;
      startingOffset.current = offset;
    },
    [duration, offset]
  );

  const handleDragEnd = useCallback(() => {
    onUpdateAnimation({ duration: internalDuration, offset: internalOffset });
  }, [internalDuration, internalOffset, onUpdateAnimation]);

  const handleDragLeft = useCallback(({ clientX }) => {
    const movedMilliseconds = Math.max(
      ((clientX - dragStart.current) / MARK_OFFSET) * MS_DIVISOR,
      -startingOffset.current
    );
    setOffset(Math.max(0, movedMilliseconds + startingOffset.current));
    setDuration(startingDuration.current - movedMilliseconds);
  }, []);

  const handleDragMiddle = useCallback(
    ({ clientX }) => {
      const stop =
        maxDuration - (startingOffset.current + startingDuration.current);
      const movedMilliseconds = Math.min(
        Math.max(
          ((clientX - dragStart.current) / MARK_OFFSET) * MS_DIVISOR,
          -startingOffset.current
        ),
        stop
      );
      setOffset(movedMilliseconds + startingOffset.current);
    },
    [maxDuration]
  );

  const handleDragRight = useCallback(
    ({ clientX }) => {
      const stop =
        maxDuration - (startingOffset.current + startingDuration.current);
      const movedMilliseconds = Math.min(
        ((clientX - dragStart.current) / MARK_OFFSET) * MS_DIVISOR,
        stop
      );
      setDuration(movedMilliseconds + startingDuration.current);
    },
    [maxDuration]
  );

  useKeyDownEffect(
    leftRef,
    { key: ['left', 'right'] },
    ({ key }) => {
      setDuration(internalDuration + (key === 'ArrowLeft' ? -100 : 100));
      handleDragEnd();
    },
    [leftRef, handleDragEnd, internalDuration]
  );

  useKeyDownEffect(
    rightRef,
    { key: ['left', 'right'] },
    ({ key }) => {
      switch (key) {
        case 'ArrowRight':
          setDuration(
            Math.min(internalDuration + KEY_OFFSET_MS, maxDuration - offset)
          );
          break;
        case 'ArrowLeft':
          setDuration(
            Math.max(internalDuration - KEY_OFFSET_MS, MIN_ANIMATION_MS)
          );
          break;
        default:
          break;
      }

      handleDragEnd();
    },
    [rightRef, handleDragEnd, internalDuration, maxDuration, duration, offset]
  );

  return (
    <Bar
      style={{
        width: (internalDuration / MS_DIVISOR) * MARK_OFFSET,
        left: (internalOffset / MS_DIVISOR) * MARK_OFFSET,
      }}
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
      <Label ref={setMiddleRef}>
        {label}
        <Moveable
          target={middleRef}
          onDragStart={handleDragStart}
          onDrag={handleDragMiddle}
          onDragEnd={handleDragEnd}
          {...commonMovableProps}
        />
      </Label>
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
  maxDuration: propTypes.number.isRequired,
  offset: propTypes.number.isRequired,
  label: propTypes.string.isRequired,
  onUpdateAnimation: propTypes.func.isRequired,
};
