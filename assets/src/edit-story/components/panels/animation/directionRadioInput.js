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
import { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import {
  DIRECTION,
  ROTATION,
  SCALE_DIRECTION,
  SCALE_DIRECTION_MAP,
} from '../../../../animation';
import useRadioNavigation from '../../form/shared/useRadioNavigation';
import WithTooltip from '../../tooltip';

const Svg = styled.svg`
  display: block;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  fill: none;
  transform-origin: 50% 50%;
`;

const Icon = styled.div`
  padding: 6px;
  border-radius: 4px;
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

  ${({ selected }) =>
    selected &&
    css`
      svg {
        stroke: ${({ theme }) => theme.colors.activeDirection};
        stroke-width: 2px;
      }
    `}
`;

const RotationIcon = () => (
  <Svg size="16px" viewBox="0 0 19 18">
    <path
      strokeLinecap="round"
      d="M1 17.5V17.5C1 10.5964 6.59644 5 13.5 5L17.5 5M17.5 5L13.5 1M17.5 5L13.5 9"
    />
  </Svg>
);

const DirectionIcon = () => (
  <Svg size="13px" viewBox="0 0 10 11">
    <path strokeLinecap="round" d="M5 11L5 1M5 1L9 5M5 1L1 5" />
  </Svg>
);

const Direction = ({ className, direction, selected }) => (
  <Icon className={className} direction={direction} selected={selected}>
    {Object.values(DIRECTION).includes(direction) ||
    Object.values(SCALE_DIRECTION).includes(direction) ? (
      <DirectionIcon />
    ) : (
      <RotationIcon />
    )}
  </Icon>
);

// Must be a styled component to add component selectors in css
const DirectionIndicator = styled(Direction)`
  stroke: #e4e5e6;
  stroke-width: 1px;
`;

const Fieldset = styled.fieldset`
  position: relative;
  height: 80px;
  width: 80px;
  border: 1px solid #393d3f;
`;

const Figure = styled.div`
  position: absolute;
  display: block;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: ${({ theme }) => theme.colors.fg.v9};
  background: #e4e5e6;
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
          right: 4px;
          transform: translateY(-50%);
        `;
      case DIRECTION.TOP_TO_BOTTOM:
        return css`
          top: 4px;
          left: 50%;
          transform: translateX(-50%);
        `;
      case DIRECTION.LEFT_TO_RIGHT:
        return css`
          top: 50%;
          left: 4px;
          transform: translateY(-50%);
        `;
      case ROTATION.CLOCKWISE:
        return css`
          top: 4px;
          left: 4px;
          transform: translateX(20%);
        `;
      case ROTATION.COUNTER_CLOCKWISE:
        return css`
          bottom: 4px;
          right: 4px;
          transform: translate(-10%, -10%);
        `;

      case SCALE_DIRECTION.SCALE_OUT_BOTTOM_LEFT:
        return css`
          bottom: 0;
          left: 0;
          transform: rotate(-135deg);
        `;

      case SCALE_DIRECTION.SCALE_IN_TOP_LEFT:
        return css`
          top: 0;
          left: 0;
          transform: rotate(135deg);
        `;

      case SCALE_DIRECTION.SCALE_OUT_TOP_RIGHT:
        return css`
          top: 0;
          right: 0;
          transform: rotate(-315deg);
        `;

      case SCALE_DIRECTION.SCALE_IN_BOTTOM_RIGHT:
        return css`
          bottom: 0;
          right: 0;
          transform: rotate(315deg);
        `;

      default:
        return css`
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
        `;
    }
  }}

  input:disabled ~ * > ${DirectionIndicator} {
    stroke: #5e6668;
  }

  input:checked:not(:disabled) ~ * > ${DirectionIndicator} {
    background-color: #51389d;
  }

  input:focus ~ * > ${DirectionIndicator} {
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
  [SCALE_DIRECTION.SCALE_IN]: __('scale in', 'web-stories'),
  [SCALE_DIRECTION.SCALE_OUT]: __('scale out', 'web-stories'),
};

const valueForInternalValue = (value) => {
  switch (value) {
    case SCALE_DIRECTION.SCALE_IN_TOP_LEFT:
      return SCALE_DIRECTION.SCALE_IN;
    case SCALE_DIRECTION.SCALE_IN_BOTTOM_RIGHT:
      return SCALE_DIRECTION.SCALE_IN;
    case SCALE_DIRECTION.SCALE_OUT_BOTTOM_LEFT:
      return SCALE_DIRECTION.SCALE_OUT;
    case SCALE_DIRECTION.SCALE_OUT_TOP_RIGHT:
      return SCALE_DIRECTION.SCALE_OUT;
    default:
      return value;
  }
};

const getPrefixFromCamelCase = (camelCase = '') =>
  camelCase
    ?.replace(/([a-z])([A-Z])/g, '$1 $2')
    ?.toLocaleLowerCase()
    ?.split(' ')?.[0];

export const DirectionRadioInput = ({ value, directions = [], onChange }) => {
  const inputRef = useRef();

  const flattenedDirections = useMemo(() => {
    const dir = [];
    if (
      !directions.includes(SCALE_DIRECTION.SCALE_OUT) &&
      !directions.includes(SCALE_DIRECTION.SCALE_IN)
    ) {
      dir.push(...directions);
    } else {
      // Controlling order these get added to flattenedDirections makes sure the indexable order makes sense for keyboard users
      directions.includes(SCALE_DIRECTION.SCALE_OUT) &&
        dir.push(
          SCALE_DIRECTION_MAP.SCALE_OUT[0],
          SCALE_DIRECTION_MAP.SCALE_OUT[1]
        );
      directions.includes(SCALE_DIRECTION.SCALE_IN) &&
        dir.push(
          SCALE_DIRECTION_MAP.SCALE_IN[0],
          SCALE_DIRECTION_MAP.SCALE_IN[1]
        );
    }
    return dir;
  }, [directions]);
  useRadioNavigation(inputRef);

  return (
    <Fieldset>
      <Figure />
      <HiddenLegend>{__('Which Direction?', 'web-stories')}</HiddenLegend>
      <RadioGroup ref={inputRef}>
        {flattenedDirections.map((direction) => {
          const isDisabled = disabled.includes(direction);
          return (
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
                value={valueForInternalValue(direction)}
                onChange={onChange}
                checked={value === direction || direction?.includes(value)}
                disabled={isDisabled}
              />
              <WithTooltip
                title={isDisabled ? tooltip : ''}
                placement={getPrefixFromCamelCase(direction)}
              >
                <DirectionIndicator
                  direction={direction}
                  selected={value === direction || direction?.includes(value)}
                />
              </WithTooltip>
            </Label>
          );
        })}
      </RadioGroup>
    </Fieldset>
  );
};

const directionPropType = PropTypes.oneOf([
  ...Object.values(DIRECTION),
  ...Object.values(ROTATION),
  ...Object.values(SCALE_DIRECTION),
]);

DirectionRadioInput.propTypes = {
  value: directionPropType,
  directions: PropTypes.arrayOf(directionPropType),
  disabled: PropTypes.arrayOf(directionPropType),
  onChange: PropTypes.func,
  tooltip: PropTypes.string,
};

Direction.propTypes = {
  className: PropTypes.string,
  direction: directionPropType,
  selected: PropTypes.bool,
};
