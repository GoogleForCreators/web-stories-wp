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
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import generatePatternCSS from '../../utils/generatePatternCSS';
import { ColorStopPropType } from '../../types';
import { ReactComponent as Reverse } from '../../icons/gradient_reverser.svg';
import { ReactComponent as Rotate } from '../../icons/gradient_rotator.svg';
import Pointer from './pointer';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: -3px;
`;

const LINE_LENGTH = 155;
const LINE_WIDTH = 12;
const LINE_FULL_LENGTH = LINE_LENGTH + LINE_WIDTH;

const Line = styled.div.attrs(({ stops }) => ({
  style: generatePatternCSS({
    type: 'linear',
    // "Push" the ends of the gradient in, so it starts and
    // ends at (LINE_WIDTH / 2) px
    stops: stops.map(({ color, position }) => ({
      color,
      position: (position * LINE_LENGTH + LINE_WIDTH / 2) / LINE_FULL_LENGTH,
    })),
    rotation: 0.25,
  }),
}))`
  width: ${LINE_FULL_LENGTH}px;
  height: ${LINE_WIDTH}px;
  border-radius: ${LINE_WIDTH / 2}px;
  position: relative;
`;

const Stop = styled.div.attrs(({ position }) => ({
  style: {
    left: `${position * 155 + 6}px`,
  },
}))`
  position: absolute;
  top: 6px;
  ${({ isSelected }) =>
    isSelected &&
    `
    transform-origin: 0 0;
    transform: scale(1.333);
  `}
`;

const Button = styled.button`
  border: 0;
  padding: 0;
  background: transparent;
  display: flex;
  color: white;

  svg {
    width: 16px;
    height: 16px;
  }
`;

function GradientPicker({
  stops,
  currentStopIndex,

  onSelect /*,
  onAdd,
  onDelete,
  onMove*/,

  onRotate,
  onReverse,
}) {
  return (
    <Wrapper>
      <Line stops={stops}>
        {stops.map(({ position }, index) => (
          <Stop
            key={index}
            isSelected={index === currentStopIndex}
            position={position}
          >
            <Pointer onPointerDown={() => onSelect(index)} offset={-6} />
          </Stop>
        ))}
      </Line>
      <Button onClick={onReverse}>
        <Reverse />
      </Button>
      <Button onClick={onRotate}>
        <Rotate />
      </Button>
    </Wrapper>
  );
}

GradientPicker.propTypes = {
  stops: PropTypes.arrayOf(ColorStopPropType),
  currentStopIndex: PropTypes.number.isRequired,

  onSelect:
    PropTypes.func
      .isRequired /*,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired*/,

  onReverse: PropTypes.func.isRequired,
  onRotate: PropTypes.func.isRequired,
};

export default GradientPicker;
