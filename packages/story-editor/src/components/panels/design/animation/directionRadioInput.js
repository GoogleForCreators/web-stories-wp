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
import { useMemo, useRef } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { __, _x } from '@googleforcreators/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
} from '@googleforcreators/design-system';
import {
  DIRECTION,
  ROTATION,
  SCALE_DIRECTION,
  SCALE_DIRECTION_MAP,
} from '@googleforcreators/animation';
/**
 * Internal dependencies
 */
import { useConfig } from '../../../../app/config';
import useRadioNavigation from '../../../form/shared/useRadioNavigation';
import Tooltip from '../../../tooltip';

const StyledButton = styled(Button)`
  z-index: 0;
  width: 28px;
  height: 28px;
  ${({ selected, disabled, theme }) =>
    selected &&
    !disabled &&
    css`
      background-color: ${theme.colors.interactiveBg.secondaryPress};
    `}

  svg {
    transform-origin: 50% 50%;
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
        case SCALE_DIRECTION.SCALE_OUT_BOTTOM_LEFT:
          return 'rotate(-135deg)';
        case SCALE_DIRECTION.SCALE_IN_TOP_LEFT:
          return 'rotate(135deg)';
        case SCALE_DIRECTION.SCALE_OUT_TOP_RIGHT:
          return 'rotate(-315deg)';
        case SCALE_DIRECTION.SCALE_IN_BOTTOM_RIGHT:
          return 'rotate(315deg)';
        default:
          return 'rotate(0deg)';
      }
    }};
  }
`;

const Direction = ({ className, direction, ...rest }) => (
  <StyledButton
    variant={BUTTON_VARIANTS.SQUARE}
    type={BUTTON_TYPES.TERTIARY}
    size={BUTTON_SIZES.SMALL}
    className={className}
    direction={direction}
    {...rest}
  >
    {[...Object.values(DIRECTION), ...Object.values(SCALE_DIRECTION)].includes(
      direction
    ) && <Icons.ArrowUp />}
  </StyledButton>
);

// Must be a styled component to add component selectors in css
const DirectionIndicator = styled(Direction)``;

const Fieldset = styled.fieldset`
  position: relative;
  height: 91px;
  width: 88px;
  margin-top: 1px;
  border-right: 1px solid ${({ theme }) => theme.colors.border.defaultNormal};
`;

const Figure = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.fg.primary};
  border-radius: 2px;
  transform: translate(-50%, -50%);
`;

const SPACE_FROM_EDGE = 3;
const Label = styled.label`
  position: absolute;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};

  ${({ direction }) => {
    switch (direction) {
      case DIRECTION.RIGHT_TO_LEFT:
        return css`
          top: 50%;
          right: ${SPACE_FROM_EDGE}px;
          transform: translateY(-50%);
        `;
      case DIRECTION.TOP_TO_BOTTOM:
        return css`
          top: ${SPACE_FROM_EDGE}px;
          left: 50%;
          transform: translateX(-50%);
        `;
      case DIRECTION.LEFT_TO_RIGHT:
        return css`
          top: 50%;
          left: ${SPACE_FROM_EDGE}px;
          transform: translateY(-50%);
        `;
      case ROTATION.COUNTER_CLOCKWISE:
        return css`
          bottom: ${SPACE_FROM_EDGE}px;
          right: ${SPACE_FROM_EDGE}px;
          transform: translate(-10%, -10%);
        `;

      case SCALE_DIRECTION.SCALE_OUT_BOTTOM_LEFT:
        return css`
          bottom: ${SPACE_FROM_EDGE}px;
          left: ${SPACE_FROM_EDGE}px;
        `;
      case SCALE_DIRECTION.SCALE_IN_TOP_LEFT:
        return css`
          top: ${SPACE_FROM_EDGE}px;
          left: ${SPACE_FROM_EDGE}px;
        `;
      case SCALE_DIRECTION.SCALE_OUT_TOP_RIGHT:
        return css`
          top: ${SPACE_FROM_EDGE}px;
          right: ${SPACE_FROM_EDGE}px;
        `;
      case SCALE_DIRECTION.SCALE_IN_BOTTOM_RIGHT:
        return css`
          bottom: ${SPACE_FROM_EDGE}px;
          right: ${SPACE_FROM_EDGE}px;
        `;

      default:
        return css`
          bottom: ${SPACE_FROM_EDGE}px;
          left: 50%;
          transform: translateX(-50%);
        `;
    }
  }}
`;

const HiddenLegend = styled.legend`
  position: absolute;
  opacity: 0;
  clip-path: polygon(0 0);
  cursor: pointer;
`;

const RadioGroup = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const translations = {
  [DIRECTION.RIGHT_TO_LEFT]: _x(
    'right to left',
    'animation direction',
    'web-stories'
  ),
  [DIRECTION.LEFT_TO_RIGHT]: _x(
    'left to right',
    'animation direction',
    'web-stories'
  ),
  [DIRECTION.TOP_TO_BOTTOM]: _x(
    'top to bottom',
    'animation direction',
    'web-stories'
  ),
  [DIRECTION.BOTTOM_TO_TOP]: _x(
    'bottom to top',
    'animation direction',
    'web-stories'
  ),
  [ROTATION.CLOCKWISE]: _x('clockwise', 'rotation direction', 'web-stories'),
  [ROTATION.COUNTER_CLOCKWISE]: _x(
    'counterclockwise',
    'rotation direction',
    'web-stories'
  ),
  [SCALE_DIRECTION.SCALE_IN]: _x('scale in', 'scale direction', 'web-stories'),
  [SCALE_DIRECTION.SCALE_OUT]: _x(
    'scale out',
    'scale direction',
    'web-stories'
  ),
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
const isInternalScaleDirection = (value) =>
  [...SCALE_DIRECTION_MAP.SCALE_IN, ...SCALE_DIRECTION_MAP.SCALE_OUT].includes(
    value
  );

const splitCamelCase = (camelCase = '') =>
  camelCase
    ?.replace(/([a-z])([A-Z])/g, '$1 $2')
    ?.toLocaleLowerCase()
    ?.split(' ') || [];

const getPrefixFromCamelCase = (camelCase = '') =>
  splitCamelCase(camelCase)?.[0];

const getPostfixFromCamelCase = (camelCase = '') => {
  const split = splitCamelCase(camelCase);
  return split[split.length - 1];
};

const STANDARD_NAV_ORDER = [
  DIRECTION.TOP_TO_BOTTOM,
  DIRECTION.RIGHT_TO_LEFT,
  DIRECTION.BOTTOM_TO_TOP,
  DIRECTION.LEFT_TO_RIGHT,
];

const SCALE_NAV_ORDER = [
  SCALE_DIRECTION.SCALE_IN_TOP_LEFT,
  SCALE_DIRECTION.SCALE_OUT_TOP_RIGHT,
  SCALE_DIRECTION.SCALE_IN_BOTTOM_RIGHT,
  SCALE_DIRECTION.SCALE_OUT_BOTTOM_LEFT,
];

const sortInputOrderForKeyboardUsability = (
  directions,
  directionOrder,
  isRTL
) => {
  const referenceOrder = isRTL ? directionOrder.reverse() : directionOrder;

  return directions.sort(
    (a, b) => referenceOrder.indexOf(a) - referenceOrder.indexOf(b)
  );
};

export const DirectionRadioInput = ({
  value,
  directions = [],
  onChange,
  disabled = [],
  tooltip,
}) => {
  const inputRef = useRef();
  const { isRTL } = useConfig();

  const flattenedDirections = useMemo(() => {
    const dir = [];
    if (
      !directions.includes(SCALE_DIRECTION.SCALE_OUT) &&
      !directions.includes(SCALE_DIRECTION.SCALE_IN)
    ) {
      dir.push(
        ...sortInputOrderForKeyboardUsability(
          directions,
          STANDARD_NAV_ORDER,
          isRTL
        )
      );
    } else {
      const scaleDir = [];

      directions.includes(SCALE_DIRECTION.SCALE_OUT) &&
        scaleDir.push(...SCALE_DIRECTION_MAP.SCALE_OUT);
      directions.includes(SCALE_DIRECTION.SCALE_IN) &&
        scaleDir.push(...SCALE_DIRECTION_MAP.SCALE_IN);
      dir.push(
        ...sortInputOrderForKeyboardUsability(scaleDir, SCALE_NAV_ORDER, isRTL)
      );
    }
    return dir;
  }, [directions, isRTL]);

  useRadioNavigation(inputRef);

  return (
    <Fieldset>
      <Figure />
      <HiddenLegend>{__('Which Direction?', 'web-stories')}</HiddenLegend>
      <RadioGroup ref={inputRef}>
        {flattenedDirections.map((direction) => {
          const isDisabled = disabled?.includes(
            valueForInternalValue(direction)
          );
          return (
            <Label
              key={direction}
              aria-label={translations[direction]}
              htmlFor={direction}
              direction={direction}
              disabled={isDisabled}
            >
              <Tooltip
                title={isDisabled ? tooltip : ''}
                placement={
                  isInternalScaleDirection(direction)
                    ? getPostfixFromCamelCase(direction)
                    : getPrefixFromCamelCase(direction)
                }
              >
                <DirectionIndicator
                  direction={direction}
                  selected={value === direction || direction?.includes(value)}
                  disabled={isDisabled}
                  onClick={() => onChange(valueForInternalValue(direction))}
                />
              </Tooltip>
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
  disabled: PropTypes.bool,
};
