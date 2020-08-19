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
import styled, { css } from 'styled-components';
/**
 * Internal dependencies
 */
import { DIRECTION } from '../../../../animation';

const Container = styled.div`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 63px;
  width: 63px;
  background-color: #1c1c1c;
  border: 1px solid #2c2c2c;
  border-radius: 4px;
`;

const SampleElement = styled.div`
  width: 16px;
  height: 24px;
  background: #2c2c2c;
  border: 1px solid #2c2c2c;
  border-radius: 2px;
`;

const Svg = styled.svg`
  display: block;
  height: 10px;
  width: 10px;
  fill: none;
  transform-origin: 50% 50%;
  transform: rotate(
    ${({ direction }) => {
      switch (direction) {
        case DIRECTION.RIGHT_TO_LEFT:
          return '270deg';
        case DIRECTION.TOP_TO_BOTTOM:
          return '180deg';
        case DIRECTION.LEFT_TO_RIGHT:
          return '90deg';
        default:
          return '0deg';
      }
    }}
  );
`;

const Icon = styled.div`
  padding: 4px;
`;

const Direction = ({ className, direction }) => (
  <Icon className={className}>
    <Svg viewBox="0 0 10 11" direction={direction}>
      <path d="M5 11L5 1M5 1L9 5M5 1L1 5" />
    </Svg>
  </Icon>
);

Direction.propTypes = {
  className: PropTypes.string,
  direction: PropTypes.oneOf(Object.values(DIRECTION)),
};

// Must be a styled component to add component css selectors
const DirectionIndicator = styled(Direction)``;

const Label = styled.label`
  position: absolute;
  cursor: pointer;

  ${({ direction }) => {
    switch (direction) {
      case DIRECTION.RIGHT_TO_LEFT:
        return css`
          top: 50%;
          right: 0;
          transform: translateY(-50%);
        `;
      case DIRECTION.TOP_TO_BOTTOM:
        return css`
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        `;
      case DIRECTION.LEFT_TO_RIGHT:
        return css`
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        `;
      default:
        return css`
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        `;
    }
  }}

  ${DirectionIndicator} {
    stroke: #6c6c6c;
    stroke-width: 1px;
  }
  input:checked ~ ${DirectionIndicator} {
    stroke: #dd8162;
    stroke-width: 2px;
  }
  input:focus ~ ${DirectionIndicator} {
    outline: 5px auto -webkit-focus-ring-color;
  }
`;
const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  clip-path: polygon(0 0);
  cursor: pointer;
`;

export const DirectionRadioInput = ({
  directions = [],
  onChange,
  defaultValue,
}) => {
  return (
    <Container>
      <SampleElement />
      {directions.map((direction) => (
        <Label key={direction} direction={direction}>
          <HiddenInput
            type="radio"
            name="direction"
            value={direction}
            onChange={onChange}
            defaultChecked={defaultValue === direction}
          />
          <DirectionIndicator direction={direction} />
        </Label>
      ))}
    </Container>
  );
};

DirectionRadioInput.propTypes = {
  defaultValue: PropTypes.oneOf(Object.values(DIRECTION)),
  directions: PropTypes.arrayOf(PropTypes.oneOf(Object.values(DIRECTION))),
  onChange: PropTypes.func,
};
