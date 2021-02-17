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
import { useKeyDownEffect } from '../../../design-system';
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
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.label.family};
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
  delay,
  label,
  onUpdateAnimation,
}) {
  const leftRef = useRef();
  const middleRef = useRef();
  const rightRef = useRef();
  const dragStart = useRef(0);
  const startingDuration = useRef(0);
  const startingDelay = useRef(0);
  const [mountMovable, setMountMovable] = useState(false);

  const [internalDuration, setDuration] = useState(duration);
  const [internalDelay, setDelay] = useState(delay);

  const handleDragStart = useCallback(
    ({ clientX }) => {
      dragStart.current = clientX;
      startingDuration.current = duration;
      startingDelay.current = delay;
    },
    [duration, delay]
  );

  useEffect(() => {
    setMountMovable(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    onUpdateAnimation({ duration: internalDuration, delay: internalDelay });
  }, [internalDuration, internalDelay, onUpdateAnimation]);

  const handleDragLeft = useCallback(({ clientX }) => {
    const movedMilliseconds = Math.max(
      ((clientX - dragStart.current) / MARK_OFFSET) * MS_DIVISOR,
      -startingDelay.current
    );
    setDelay(Math.max(0, movedMilliseconds + startingDelay.current));
    setDuration(startingDuration.current - movedMilliseconds);
  }, []);

  const handleDragMiddle = useCallback(
    ({ clientX }) => {
      const stop =
        maxDuration - (startingDelay.current + startingDuration.current);
      const movedMilliseconds = Math.min(
        Math.max(
          ((clientX - dragStart.current) / MARK_OFFSET) * MS_DIVISOR,
          -startingDelay.current
        ),
        stop
      );
      setDelay(movedMilliseconds + startingDelay.current);
    },
    [maxDuration]
  );

  const handleDragRight = useCallback(
    ({ clientX }) => {
      const stop =
        maxDuration - (startingDelay.current + startingDuration.current);
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
      let updatedDelay;
      switch (key) {
        case 'ArrowRight':
          updatedDelay = Math.min(
            internalDelay + KEY_OFFSET_MS,
            internalDuration + internalDelay - MIN_ANIMATION_MS
          );
          updatedDuration = Math.max(
            internalDuration - KEY_OFFSET_MS,
            MIN_ANIMATION_MS
          );
          setDelay(updatedDelay);
          setDuration(updatedDuration);
          break;
        case 'ArrowLeft':
          updatedDelay = Math.max(internalDelay - KEY_OFFSET_MS, 0);
          setDelay(updatedDelay);
          if (internalDelay === 0) {
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
        delay: updatedDelay,
      });
    },
    [
      leftRef,
      handleDragEnd,
      internalDuration,
      maxDuration,
      delay,
      internalDelay,
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
            maxDuration - delay
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

      onUpdateAnimation({ duration: updatedDuration, delay: internalDelay });
    },
    [
      rightRef,
      handleDragEnd,
      internalDuration,
      maxDuration,
      duration,
      delay,
      internalDelay,
      onUpdateAnimation,
    ]
  );

  useKeyDownEffect(
    middleRef,
    { key: ['left', 'right'] },
    ({ key }) => {
      let updatedDelay;
      switch (key) {
        case 'ArrowRight':
          updatedDelay = Math.min(
            internalDelay + KEY_OFFSET_MS,
            maxDuration - internalDuration
          );
          setDelay(updatedDelay);
          break;
        case 'ArrowLeft':
          updatedDelay = Math.max(internalDelay - KEY_OFFSET_MS, 0);
          setDelay(updatedDelay);
          break;
        default:
          break;
      }

      onUpdateAnimation({ duration: internalDuration, delay: updatedDelay });
    },
    [
      middleRef,
      handleDragEnd,
      internalDuration,
      maxDuration,
      duration,
      delay,
      internalDelay,
      onUpdateAnimation,
    ]
  );

  return (
    <Bar
      style={{
        width: (internalDuration / MS_DIVISOR) * MARK_OFFSET,
        left: (internalDelay / MS_DIVISOR) * MARK_OFFSET,
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
  delay: propTypes.number.isRequired,
  label: propTypes.string.isRequired,
  onUpdateAnimation: propTypes.func.isRequired,
};
