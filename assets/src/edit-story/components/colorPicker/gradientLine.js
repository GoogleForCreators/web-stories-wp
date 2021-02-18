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
import { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __, sprintf } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import generatePatternStyles from '../../utils/generatePatternStyles';
import { ColorStopPropType } from '../../types';
import Pointer from './pointer';
import GradientStop from './gradientStop';
import useKeyMoveStop from './useKeyMoveStop';
import useKeyAddStop from './useKeyAddStop';
import useKeyDeleteStop from './useKeyDeleteStop';
import useKeyFocus from './useKeyFocus';
import usePointerAddStop from './usePointerAddStop';
import usePointerMoveStop from './usePointerMoveStop';
import { LINE_LENGTH, LINE_WIDTH } from './constants';

const LINE_FULL_LENGTH = LINE_LENGTH + LINE_WIDTH;

const Line = styled.div.attrs(({ stops }) => ({
  tabIndex: -1,
  style: generatePatternStyles({
    type: 'linear',
    // "Push" the ends of the gradient in, so it starts and
    // ends at (LINE_WIDTH / 2) px
    stops: stops.map(({ color, position }) => ({
      color,
      position: (position * LINE_LENGTH + LINE_WIDTH / 2) / LINE_FULL_LENGTH,
    })),
    // And fix rotation to .25 to make it go right-to-left
    rotation: 0.25,
  }),
}))`
  width: ${LINE_FULL_LENGTH}px;
  height: ${LINE_WIDTH}px;
  border-radius: 2px;
  position: relative;

  &:focus {
    /* The line will only have temporary focus while deleting stops */
    outline: none;
  }
`;

const TempPointer = styled(Pointer).attrs(({ x }) => ({
  style: {
    left: `${x}px`,
  },
  offsetX: -LINE_WIDTH / 2,
}))`
  height: ${LINE_WIDTH - 2}px;
  width: ${LINE_WIDTH - 2}px;
  opacity: 0.6;
  top: 1px;
  pointer-events: none;
`;

function GradientLine({
  stops,
  currentStopIndex,

  onSelect,
  onAdd,
  onDelete,
  onMove,
}) {
  const line = useRef();

  useKeyMoveStop(line, onMove, stops, currentStopIndex);
  useKeyAddStop(line, onAdd, stops, currentStopIndex);
  useKeyDeleteStop(line, onDelete);
  const stopRefs = useKeyFocus(line, stops, currentStopIndex);

  usePointerMoveStop(line, onMove);
  const tempPointerPosition = usePointerAddStop(line, onAdd);

  return (
    <Line
      stops={stops}
      ref={line}
      aria-label={__('Gradient line', 'web-stories')}
    >
      {stops.map(({ position, color }, index) => (
        <GradientStop
          ref={(ref) => (stopRefs[index].current = ref)}
          key={
            /* eslint-disable-next-line react/no-array-index-key */
            index
          }
          index={index}
          isSelected={index === currentStopIndex}
          position={position}
          onSelect={onSelect}
          color={{ color }}
        >
          <Pointer offsetX={-LINE_WIDTH / 2} />
        </GradientStop>
      ))}
      {tempPointerPosition && (
        <TempPointer
          aria-label={sprintf(
            /* translators: %d: stop percentage */
            __('Temporary gradient stop at %1$d%%', 'web-stories'),
            Math.round(
              (100 * (tempPointerPosition - LINE_WIDTH / 2)) / LINE_LENGTH
            )
          )}
          x={tempPointerPosition}
        />
      )}
    </Line>
  );
}

GradientLine.propTypes = {
  stops: PropTypes.arrayOf(ColorStopPropType),
  currentStopIndex: PropTypes.number.isRequired,

  onSelect: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
};

export default GradientLine;
