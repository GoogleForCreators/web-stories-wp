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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';
import Moveable from 'react-moveable';

/**
 * Internal dependencies
 */
import { useKeyDownEffect } from '../keyboard';
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
  const leftRef = useRef();
  const middleRef = useRef();
  const rightRef = useRef();
  const dragStart = useRef(0);
  const startingDuration = useRef(0);
  const startingOffset = useRef(0);
  const [mountMovable, setMountMovable] = useState(false);

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

  useEffect(() => {
    setMountMovable(true);
  }, []);

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
      let updatedDuration;
      let updatedOffset;
      switch (key) {
        case 'ArrowRight':
          updatedOffset = Math.min(
            internalOffset + KEY_OFFSET_MS,
            internalDuration + internalOffset - MIN_ANIMATION_MS
          );
          updatedDuration = Math.max(
            internalDuration - KEY_OFFSET_MS,
            MIN_ANIMATION_MS
          );
          setOffset(updatedOffset);
          setDuration(updatedDuration);
          break;
        case 'ArrowLeft':
          updatedOffset = Math.max(internalOffset - KEY_OFFSET_MS, 0);
          setOffset(updatedOffset);
          if (internalOffset === 0) {
            break;
          }
          updatedDuration = internalDuration + KEY_OFFSET_MS;
          setDuration(updatedDuration);
          break;
        default:
          break;
      }

      onUpdateAnimation({
        duration: updatedDuration || internalDuration,
        offset: updatedOffset,
      });
    },
    [
      leftRef,
      handleDragEnd,
      internalDuration,
      maxDuration,
      offset,
      internalOffset,
      duration,
      onUpdateAnimation,
    ]
  );

  useKeyDownEffect(
    rightRef,
    { key: ['left', 'right'] },
    ({ key }) => {
      let updatedDuration;
      switch (key) {
        case 'ArrowRight':
          updatedDuration = Math.min(
            internalDuration + KEY_OFFSET_MS,
            maxDuration - offset
          );
          setDuration(updatedDuration);
          break;
        case 'ArrowLeft':
          updatedDuration = Math.max(
            internalDuration - KEY_OFFSET_MS,
            MIN_ANIMATION_MS
          );
          setDuration(updatedDuration);
          break;
        default:
          break;
      }

      onUpdateAnimation({ duration: updatedDuration, offset: internalOffset });
    },
    [
      rightRef,
      handleDragEnd,
      internalDuration,
      maxDuration,
      duration,
      offset,
      internalOffset,
      onUpdateAnimation,
    ]
  );

  useKeyDownEffect(
    middleRef,
    { key: ['left', 'right'] },
    ({ key }) => {
      let updatedOffset;
      switch (key) {
        case 'ArrowRight':
          updatedOffset = Math.min(
            internalOffset + KEY_OFFSET_MS,
            maxDuration - internalDuration
          );
          setOffset(updatedOffset);
          break;
        case 'ArrowLeft':
          updatedOffset = Math.max(internalOffset - KEY_OFFSET_MS, 0);
          setOffset(updatedOffset);
          break;
        default:
          break;
      }

      onUpdateAnimation({ duration: internalDuration, offset: updatedOffset });
    },
    [
      middleRef,
      handleDragEnd,
      internalDuration,
      maxDuration,
      duration,
      offset,
      internalOffset,
      onUpdateAnimation,
    ]
  );

  return (
    <Bar
      style={{
        width: (internalDuration / MS_DIVISOR) * MARK_OFFSET,
        left: (internalOffset / MS_DIVISOR) * MARK_OFFSET,
      }}
    >
      <Handle ref={leftRef} data-testid={`start-animation-handle-${label}`}>
        {mountMovable && (
          <Moveable
            target={leftRef.current}
            onDragStart={handleDragStart}
            onDrag={handleDragLeft}
            onDragEnd={handleDragEnd}
            {...commonMovableProps}
          />
        )}
      </Handle>
      <Label ref={middleRef} data-testid={`location-animation-handle-${label}`}>
        {label}
        {mountMovable && (
          <Moveable
            target={middleRef.current}
            onDragStart={handleDragStart}
            onDrag={handleDragMiddle}
            onDragEnd={handleDragEnd}
            {...commonMovableProps}
          />
        )}
      </Label>
      <Handle ref={rightRef} data-testid={`end-animation-handle-${label}`}>
        {mountMovable && (
          <Moveable
            target={rightRef.current}
            onDragStart={handleDragStart}
            onDrag={handleDragRight}
            onDragEnd={handleDragEnd}
            {...commonMovableProps}
          />
        )}
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
