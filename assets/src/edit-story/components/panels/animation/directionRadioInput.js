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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import { DIRECTION, ROTATION } from '../../../../animation';

const Svg = styled.svg`
  display: block;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  fill: none;
  transform-origin: 50% 50%;
`;

const Icon = styled.div`
  padding: 4px;
  transform: ${({ direction }) => {
    switch (direction) {
      case DIRECTION.RIGHT_TO_LEFT:
        return 'rotate(270deg)';
      case DIRECTION.TOP_TO_BOTTOM:
        return 'rotate(180deg)';
      case DIRECTION.LEFT_TO_RIGHT:
        return 'rotate(90deg)';
      case ROTATION.COUNTER_CLOCKWISE:
        return 'rotateX(180deg) rotateZ(90deg)';
      default:
        return 'rotate(0deg)';
    }
  }};
`;

const RotationIcon = () => (
  <Svg size="19px" viewBox="0 0 19 18">
    <path
      strokeLinecap="round"
      d="M1 17.5V17.5C1 10.5964 6.59644 5 13.5 5L17.5 5M17.5 5L13.5 1M17.5 5L13.5 9"
    />
  </Svg>
);

const DirectionIcon = () => (
  <Svg size="16px" viewBox="0 0 10 11">
    <path strokeLinecap="round" d="M5 11L5 1M5 1L9 5M5 1L1 5" />
  </Svg>
);

const Direction = ({ className, direction }) => (
  <Icon className={className} direction={direction}>
    {Object.values(DIRECTION).includes(direction) ? (
      <DirectionIcon />
    ) : (
      <RotationIcon />
    )}
  </Icon>
);

Direction.propTypes = {
  className: PropTypes.string,
  direction: PropTypes.oneOf(Object.values(DIRECTION)),
};

// Must be a styled component to add component selectors in css
const DirectionIndicator = styled(Direction)``;

const Fieldset = styled.fieldset`
  position: relative;
  height: 80px;
  width: 80px;
  background-color: ${({ theme }) => theme.colors.bg.workspace};
  border: 1px solid ${({ theme }) => theme.colors.fg.v9};
  border-radius: 4px;
`;

const Figure = styled.div`
  position: absolute;
  display: block;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 26px;
  background: ${({ theme }) => theme.colors.fg.v9};
  border-radius: 2px;
  transform: translate(-50%, -50%);
`;

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
      case ROTATION.CLOCKWISE:
        return css`
          top: 0;
          left: 0;
          transform: translateX(20%);
        `;
      case ROTATION.COUNTER_CLOCKWISE:
        return css`
          bottom: 0;
          right: 0;
          transform: translate(-10%, -10%);
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
    stroke: ${({ theme }) => theme.colors.fg.v9};
    stroke-width: 1px;
  }

  input:checked ~ ${DirectionIndicator} {
    stroke: ${({ theme }) => theme.colors.activeDirection};
    stroke-width: 2px;
  }

  input:focus ~ ${DirectionIndicator} {
    outline: 2px auto ${({ theme }) => theme.colors.accent.primary};
  }
`;

const hidden = css`
  position: absolute;
  opacity: 0;
  clip-path: polygon(0 0);
  cursor: pointer;
`;
const HiddenLegend = styled.legend`
  ${hidden}
`;
const HiddenInput = styled.input`
  ${hidden}
`;

const RadioGroup = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const translations = {
  [DIRECTION.RIGHT_TO_LEFT]: __('right to left', 'web-stories'),
  [DIRECTION.LEFT_TO_RIGHT]: __('left to right', 'web-stories'),
  [DIRECTION.TOP_TO_BOTTOM]: __('top to bottom', 'web-stories'),
  [DIRECTION.BOTTOM_TO_TOP]: __('bottom to top', 'web-stories'),
  [ROTATION.CLOCKWISE]: __('clockwise', 'web-stories'),
  [ROTATION.COUNTER_CLOCKWISE]: __('counterclockwise', 'web-stories'),
};

export const DirectionRadioInput = ({ value, directions = [], onChange }) => {
  return (
    <Fieldset>
      <Figure />
      <HiddenLegend>{__('Which Direction?', 'web-stories')}</HiddenLegend>
      <RadioGroup>
        {directions.map((direction) => (
          <Label
            key={direction}
            aria-label={translations[direction]}
            htmlFor={direction}
            direction={direction}
          >
            <HiddenInput
              id={direction}
              type="radio"
              name="direction"
              value={direction}
              onChange={onChange}
              checked={value === direction}
            />
            <DirectionIndicator direction={direction} />
          </Label>
        ))}
      </RadioGroup>
    </Fieldset>
  );
};

const directionPropType = PropTypes.oneOf([
  ...Object.values(DIRECTION),
  ...Object.values(ROTATION),
]);

DirectionRadioInput.propTypes = {
  value: directionPropType,
  directions: PropTypes.arrayOf(directionPropType),
  onChange: PropTypes.func,
};
